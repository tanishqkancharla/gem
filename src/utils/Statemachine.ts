/**
 * Removes the first element from a tuple.
 * TupleRest<[1,2,3> = [2,3]
 */
export type TupleRest<T extends unknown[]> = T extends [any, ...infer U]
	? U
	: never;

type AnyReducers<S> = { [key: string]: (state: S, ...args: any[]) => S };

export type Actions<R extends AnyReducers<any>> = {
	[K in keyof R]: { fn: K; args: TupleRest<Parameters<R[K]>> };
}[keyof R];

export type Dispatcher<R extends AnyReducers<any>> = {
	[K in keyof R]: (...args: TupleRest<Parameters<R[K]>>) => void;
};

export type EffectPlugin<S, R extends AnyReducers<S>> = (
	app: StateMachine<S, R>
) => Effect<S>;

export type Effect<S> = {
	update(prevState: S): void;
	destroy(): void;
};

export class StateMachine<S, R extends AnyReducers<S>> {
	private effects: Effect<S>[];

	constructor(
		public state: S,
		private reducers: R,
		plugins: EffectPlugin<S, R>[]
	) {
		this.effects = plugins.map((plugin) => plugin(this));
	}

	private onDispatches = new Set<(action: Actions<R>) => void>();

	// Override this function to log or pipe actions elsewhere.
	public onDispatch(fn: (action: Actions<R>) => void) {
		this.onDispatches.add(fn);
		return () => this.onDispatches.delete(fn);
	}

	public dispatchAction(action: Actions<R>) {
		this.actions.push(action);
		this.onDispatches.forEach((fn) => fn(action));
		if (!this.running) {
			this.running = true;
			this.flush();
		}
	}

	// Using a Proxy so that you can cmd-click on a dispatched action to find the reducer.
	public dispatch = (() => {
		const self = this;
		return new Proxy(
			{},
			{
				get(target, fn: any, receiver) {
					return (...args: any[]) => self.dispatchAction({ fn, args } as any);
				},
			}
		);
	})() as Dispatcher<R>;

	private running = false;
	private actions: Actions<R>[] = [];
	private flush() {
		if (this.actions.length === 0) {
			this.running = false;
			this.listeners.forEach((fn) => fn());
			return;
		}
		const action = this.actions.shift()!;
		const prevState = this.state;
		this.state = this.reducers[action.fn](prevState, ...action.args);
		for (const effect of this.effects) {
			effect.update(prevState);
		}
		this.flush();
	}

	public destroy() {
		for (const effect of this.effects) {
			effect.destroy();
		}
	}

	private listeners = new Set<() => void>();

	/**
	 * Listener is called after all dispatches are processed. Make sure you use the
	 * plugin argument if you want to compare with previous state for an effect.
	 */
	public addListener(listener: () => void) {
		this.listeners.add(listener);
		return () => {
			this.listeners.delete(listener);
		};
	}
}
