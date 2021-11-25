import { schema } from "./schema";
import { EditorState, Transaction } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { Node } from "prosemirror-model";
import { undo, redo, history } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { baseKeymap } from "prosemirror-commands";
import { Step } from "prosemirror-transform";
import { markdownInputRules, markdownKeyBindings } from "./markdown";
import { Cursor } from "./cursor";
import { initalContent } from "./initial";
import { tests } from "./tests";

export const main = document.querySelector("main")!;

function init() {
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

  const view = new EditorView<typeof schema>(main, {
    state,
    dispatchTransaction(this, transaction) {
      if (TEST) {
        performance.mark("tr");
      }
      let newState = this.state.apply(transaction);
      if (newState.selection.empty && newState.selection.anchor == 1) {
        // Kind of a hack fix to remove all marks when at the beginning of a empty document
        newState = newState.apply(newState.tr.setStoredMarks([]));
      }
      this.updateState(newState);
      // console.log(transaction.steps.map((x) => x.toJSON()));

      cursor.resetTimeout();
      cursor.repositionToViewAnchor(this);
      if (TEST) {
        performance.measure("tr", "tr");
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

  return { state, view, cursor };
}

if (TEST) {
  tests.map((test, i) => {
    const { state, view, cursor } = init();
    let _state = state;
    test.map((x) => {
      const tr = _state.tr;
      x.steps.map((s) => tr.step(Step.fromJSON(schema, s)));
      view.dispatch(tr);
      _state = view.state;
    });
    const times = performance
      .getEntriesByType("measure")
      .map((x) => x.duration);
    console.log(`TEST ${i}`);
    console.log(JSON.stringify(times));
    console.log(
      `AVERAGE TRANSACTION TIME FOR TEST ${i}: `,
      times.reduce((a, b) => a + b) / times.length
    );
    // Reset
    performance.clearMarks();
    performance.clearMeasures();
    cursor.repositionToViewAnchor(view);
    view.destroy();
  });
} else {
  init();
}
