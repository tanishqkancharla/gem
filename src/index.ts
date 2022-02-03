import { baseKeymap } from "prosemirror-commands";
import { history, redo, undo } from "prosemirror-history";
import { keymap } from "prosemirror-keymap";
import { Node } from "prosemirror-model";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { CursorPlugin } from "./CursorPlugin";
import { initalContent } from "./initial";
import { markdownKeyBindings } from "./MarkdownPlugin";
import { SaveStatePlugin } from "./SaveStatePlugin";
import { schema } from "./schema";
import { SyntaxHighlightPlugin } from "./SyntaxHighlightPlugin";

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
    SyntaxHighlightPlugin,
    // markdownInputRules,
    SaveStatePlugin,
    CursorPlugin,
  ],
});

const view = new EditorView<typeof schema>(main, {
  state,
});

view.focus();
