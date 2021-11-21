import { schema } from "./schema";
import { EditorState } from "prosemirror-state";
import { EditorView } from "prosemirror-view";

const state = EditorState.create({ schema });
const view = new EditorView(document.body, { state });
