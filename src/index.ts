import { schema } from "./schema";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { markdownInputRules, markdownKeyBindings } from "./markdown";
import { Cursor } from "./cursor";

export const main = document.body.children[0];

const state = EditorState.create<typeof schema>({
  doc: Node.fromJSON(schema, {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "What's on your mind?" }],
      },
    ],
  }),
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
  ],
});

const cursor = new Cursor();

const view = new EditorView<typeof schema>(main, {
  state,
  dispatchTransaction(this, transaction) {
    let newState = this.state.apply(transaction);
    if (newState.selection.empty && newState.selection.anchor == 1) {
      // Kind of a hack fix to remove all marks when at the beginning of a document
      newState = newState.apply(newState.tr.setStoredMarks([]));
    }
    this.updateState(newState);

    cursor.resetTimeout();
    cursor.repositionToViewAnchor(this);
  },
});

window.addEventListener("resize", () => {
  cursor.repositionToViewAnchor(view);
});

cursor.repositionToViewAnchor(view);
