import { schema } from "./schema";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { DOMParser, Node } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";

const main = document.body.children[0];

const state = EditorState.create<typeof schema>({
  doc: Node.fromJSON(schema, {
    type: "doc",
    content: [
      {
        type: "paragraph",
        content: [{ type: "text", text: "Hey, welcome to Editor." }],
      },
    ],
  }),
  schema,
  plugins: [
    history(),
    keymap({ "Mod-z": undo, "Mod-y": redo }),
    keymap(baseKeymap),
  ],
});

function initCursor(): HTMLDivElement {
  const cursor = document.createElement("div");
  cursor.classList.add("cursor");
  main.appendChild(cursor);
  return cursor;
}

const cursor = initCursor();

const view = new EditorView<typeof schema>(main, {
  state,
  dispatchTransaction(this, transaction) {
    const newState = this.state.apply(transaction);
    this.updateState(newState);

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
