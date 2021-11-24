import { schema } from "./schema";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { markdownInputRules, markdownKeyBindings } from "./markdown";
import { Cursor } from "./cursor";
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
  ],
});

const cursor = new Cursor();

if (TEST) {
  window.times = [];
  window.transactions = [];
}

const view = new EditorView<typeof schema>(main, {
  state,
  dispatchTransaction(this, transaction) {
    if (TEST) {
      performance.mark("tr-begin");
    }
    let newState = this.state.apply(transaction);
    if (newState.selection.empty && newState.selection.anchor == 1) {
      // Kind of a hack fix to remove all marks when at the beginning of a empty document
      newState = newState.apply(newState.tr.setStoredMarks([]));
    }
    this.updateState(newState);

    cursor.resetTimeout();
    cursor.repositionToViewAnchor(this);
    if (TEST) {
      console.log(performance.measure("tr", "tr-begin"));
      console.log(performance.getEntriesByType("measure"));
      window.transactions.push(transaction);
    }
  },
});

view.root.addEventListener("focus", () => cursor.resetTimeout(), true);

view.root.addEventListener("blur", () => cursor.deactivate(), true);

window.addEventListener("resize", () => {
  cursor.repositionToViewAnchor(view);
});

view.focus();

cursor.repositionToViewAnchor(view);
