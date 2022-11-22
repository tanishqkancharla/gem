import { EditorState, Transaction } from "prosemirror-state";
import { EditorProps, EditorView } from "prosemirror-view";
import React, {
	useContext,
	useEffect,
	useLayoutEffect,
	useMemo,
	useRef,
} from "react";
import { useMemoShallowEqual } from "./utils/useMemoShallowEqual";

type EditorContextValue = {
	view: EditorView;
	focused: boolean;
};

const EditorContext = React.createContext<EditorContextValue | undefined>(
	undefined
);

export function useEditorView(): EditorView {
	const context = useContext(EditorContext);
	if (!context) {
		throw new Error("Could not find Editor View");
	}
	return context.view;
}

export function useEditorFocus(): boolean {
	const context = useContext(EditorContext);
	if (!context) {
		throw new Error("Could not find Editor View");
	}
	return context.focused;
}

type UIEditorProps = {
	editorState: EditorState;
	dispatchTransaction: (view: EditorView, tr: Transaction) => void;
	editorProps?: EditorProps;

	children?: React.ReactNode;

	focused: boolean;
	domRef?: React.RefObject<HTMLDivElement>;

	onScroll?: React.UIEventHandler;
	onMouseDown?: React.MouseEventHandler;
	onContextMenu?: React.MouseEventHandler;
};

export function UIEditor(props: UIEditorProps) {
	const {
		editorState,
		domRef,
		children,
		focused,
		dispatchTransaction,
		editorProps,
		onMouseDown,
		...eventHandlers
	} = props;

	const memoedEditorProps = useMemoShallowEqual(editorProps) || {};

	const view = useMemo(() => {
		return new EditorView(null, {
			...memoedEditorProps,
			plugins: [],
			state: editorState,
			dispatchTransaction(this: EditorView, tr) {
				// console.log(`Dispatching transaction`, tr)
				// Pass `this` as a parameter
				dispatchTransaction(this, tr);
			},
		});
	}, [dispatchTransaction, memoedEditorProps]);

	if (editorState !== view.state) {
		view.updateState(editorState);
	}

	const maybeRef = useRef<HTMLDivElement>(null);
	const nodeRef = domRef || maybeRef;

	// Mount view once rendered.
	useLayoutEffect(() => {
		const editorNode = nodeRef.current;
		if (!editorNode) return;

		const viewDom = view.dom as HTMLElement;
		editorNode.appendChild(viewDom);

		(window as any)["view"] = view;

		return () => {
			editorNode.removeChild(viewDom);
			view.destroy();
		};
	}, [view]);

	const context = useMemo(() => ({ view, focused }), [view, focused]);

	useEffect(() => {
		if (focused && !view.hasFocus()) {
			view.focus();
		}
	}, [view, focused]);

	return (
		<EditorContext.Provider value={context}>
			{children}
			<div
				className={"editor"}
				style={{
					flex: 1,
					overflowY: "auto",
					outline: "none",
				}}
				ref={nodeRef}
				{...eventHandlers}
			></div>
		</EditorContext.Provider>
	);
}
