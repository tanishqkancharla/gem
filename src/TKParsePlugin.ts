import { css } from "goober";
import { isString } from "lodash";
import { Node } from "prosemirror-model";
import { Plugin, PluginKey } from "prosemirror-state";
import { Decoration, DecorationSet } from "prosemirror-view";
import { tkBlock, TKBlock } from "tk-parser";
import { blockLinkClass } from "./blocks/BlockLink";
import { blockquoteSepClass } from "./blocks/Blockquote";
import { h1Class, h2Class, h3Class } from "./blocks/Heading";

type TKParsePluginState = {
	cache: Map<Node, Decoration[]>;
	decorations: DecorationSet;
};

const invisible = css`
	display: none;
`;

function makeBlockDecoration(
	range: [number, number],
	block: TKBlock
): Decoration[] | undefined {
	const [from, to] = range;

	switch (block.type) {
		case "h1":
			return [Decoration.node(from, to, { nodeName: "h1", class: h1Class })];
		case "h2":
			return [Decoration.node(from, to, { nodeName: "h2", class: h2Class })];
		case "h3":
			return [Decoration.node(from, to, { nodeName: "h3", class: h3Class })];
		case "blockLink":
			return [
				Decoration.node(from, to, {
					nodeName: "a",
					class: blockLinkClass,
				}),
			];

		case "blockquote":
			return [
				// Decoration.node(from, to, {
				// 	nodeName: "blockquote",
				// 	class: blockquoteClass,
				// }),
				Decoration.inline(from + 1, from + 2, {
					class: blockquoteSepClass,
				}),
			];

		default:
			return undefined;
	}
}

function makeDecorations(doc: Node, cache: Map<Node, Decoration[]>) {
	const allDecorations: Decoration[] = [];

	doc.forEach((node, offset) => {
		const cachedDecorations = cache.get(node);
		if (cachedDecorations) {
			allDecorations.push(...cachedDecorations);
			return;
		}

		const range: [number, number] = [offset, offset + node.nodeSize];
		const block = parseTKBlock(node.textContent);
		if (!block) return;

		const decorations = makeBlockDecoration(range, block);
		if (decorations) {
			allDecorations.push(...decorations);
			cache.set(node, decorations);
		}
	});
	// debugger;
	return DecorationSet.create(doc, allDecorations);
}

const tkPluginKey = new PluginKey<TKParsePluginState>("tk-parse");

function parseTKBlock(text: string): TKBlock | undefined {
	if (text === "") return undefined;

	const result = tkBlock.run(text);

	if (isString(result.value)) {
		console.warn(`Parsing tk block failed: ${result.value}`);
		return undefined;
	}

	return result.value;
}

export const TKParsePlugin = new Plugin<TKParsePluginState>({
	key: tkPluginKey,
	state: {
		init(config, { doc }) {
			const cache = new Map<Node, Decoration[]>();

			return {
				cache,
				decorations: makeDecorations(doc, cache),
			};
		},

		apply(tr, { cache }, oldState, { doc }) {
			const decorations = makeDecorations(doc, cache);
			console.log({ decorations });
			return { cache, decorations };
		},
	},

	props: {
		decorations(state) {
			const { decorations } = tkPluginKey.getState(state)!;
			return decorations;
		},
	},
});
