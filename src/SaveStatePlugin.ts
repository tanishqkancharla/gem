import { Node } from "prosemirror-model";
import { Plugin } from "prosemirror-state";
import { schema } from "./schema";

export const SaveStatePlugin = new Plugin({
  view: (view) => {
    const state = localStorage.getItem("gem-editor-state");
    if (state) {
      const stateJSON = JSON.parse(state);
      if (stateJSON) {
        const tr = view.state.tr;
        const doc = Node.fromJSON(schema, stateJSON.doc);
        tr.replaceWith(0, tr.doc.content.size, doc);
        view.dispatch(tr);
      }
    }
    return {
      update(view) {
        localStorage.setItem(
          "gem-editor-state",
          JSON.stringify(view.state.toJSON())
        );
      },
    };
  },
});
