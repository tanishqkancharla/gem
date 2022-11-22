import { css } from "goober";
import { baseKeymap } from "prosemirror-commands";
import { keymap } from "prosemirror-keymap";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorProps, EditorView } from "prosemirror-view";
import React, { useCallback, useMemo, useState } from "react";
import { UIEditor } from "./EditorView";
import { schema } from "./schema";
import { backgroundColor } from "./styles/vars";
import { TKParsePlugin } from "./TKParsePlugin";

const appClass = css`
	display: flex;
	flex-direction: row;
	gap: 10px;
	background-color: ${backgroundColor};
	margin: auto;
	width: 100vw;
	height: 100vh;
	padding: 30px;
`;

const editorClass = css`
	outline: none;
`;

function createEditorState() {
	return EditorState.create({
		schema,
		plugins: [TKParsePlugin, keymap(baseKeymap)],
	});
}

export function App(props: {}) {
	const [state, setState] = useState(createEditorState);

	const dispatchTransaction = useCallback(
		(view: EditorView, tr: Transaction) => {
			const nextState = view.state.apply(tr);
			setState(nextState);
		},
		[]
	);

	const editorProps = useMemo(
		(): EditorProps => ({
			attributes: {
				class: editorClass,
			},
		}),
		[]
	);

	return (
		<div className={appClass}>
			<UIEditor
				editorState={state}
				dispatchTransaction={dispatchTransaction}
				focused
				editorProps={editorProps}
			/>
		</div>
	);
}
