import { schema } from "./schema";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { markdownInputRules, markdownKeyBindings } from "./markdown";

const main = document.body.children[1];

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

function initCursor(): HTMLDivElement {
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  main.appendChild(cursor);
  return cursor;
}

const cursor = initCursor();
let cursorTimeout;

function deactivateCursor() {
  cursor.classList.add("inactive");
}

const view = new EditorView<typeof schema>(main, {
  state,
  dispatchTransaction(this, transaction) {
    // Transactions should be dispatched in 60 fps =>
    let newState = this.state.apply(transaction);
    if (newState.selection.empty && newState.selection.anchor == 1) {
      // Kind of a hack fix to remove all marks when at the beginning of a document
      newState = newState.apply(newState.tr.setStoredMarks([]));
    }
    this.updateState(newState);

    cursor.classList.remove("inactive");
    clearTimeout(cursorTimeout);
    cursorTimeout = setTimeout(deactivateCursor, 10000);

    const coords = this.coordsAtPos(newState.selection.anchor);
    cursor.style.transform = `translate(${coords.right - 2}px, ${
      window.scrollY + coords.top - 4
    }px)`;
  },
});

const coords = view.coordsAtPos(1, -1);
cursor.style.transform = `translate(${coords.right - 2}px, ${
  window.scrollY + coords.top - 4
}px)`;
