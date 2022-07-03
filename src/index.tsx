import React from "react";
import ReactDOM from "react-dom";
import { App } from "./App";

export const main = document.querySelector("main")!;

function setupReactApp() {
	ReactDOM.render(<App />, main);
}

setupReactApp();

// Initialize state, set up plugins
// const state = EditorState.create<typeof schema>({
//   doc: Node.fromJSON(schema, initalContent),
//   schema,
//   plugins: [
//     history(),
//     keymap<typeof schema>({
//       "Mod-z": undo,
//       "Mod-y": redo,
//       ...markdownKeyBindings,
//     }),
//     keymap<typeof schema>(baseKeymap),
//     SyntaxHighlightPlugin,
//     // markdownInputRules,
//     SaveStatePlugin,
//     CursorPlugin,
//   ],
// });

// const view = new EditorView<typeof schema>(main, {
//   state,
// });

// view.focus();
