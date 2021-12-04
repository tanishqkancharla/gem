import { EditorState } from "@codemirror/state";
import { EditorView, keymap } from "@codemirror/view";
import { defaultKeymap } from "@codemirror/commands";
import { cursorPlugin } from "./cursor";
import { initalContent } from "./initial";

export const main = document.querySelector("main")!;

let startState = EditorState.create({
  doc: initalContent,
  extensions: [keymap.of(defaultKeymap), cursorPlugin.extension],
});

let view = new EditorView({
  state: startState,
  parent: main,
});

view.focus();
