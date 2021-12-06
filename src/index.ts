import { schema } from "./schema";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { markdownInputRules, markdownKeyBindings } from "./markdown";
import { CursorPlugin } from "./cursor";
import { initalContent } from "./initial";

export const main = document.querySelector("main")!;

// Initialize state, set up plugins
const state = EditorState.create<typeof schema>({
  doc: Node.fromJSON(schema, initalContent),
  schema,
  plugins: [
    history(),
    keymap<typeof schema>({
      "Mod-z": undo,
      "Mod-y": redo,
      ...markdownKeyBindings,
    }),
    keymap<typeof schema>(baseKeymap),
    markdownInputRules,
    CursorPlugin,
  ],
});

const view = new EditorView<typeof schema>(main, {
  state,
});

view.focus();
