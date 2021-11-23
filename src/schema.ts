import { Schema } from "prosemirror-model";

interface ParagraphType {
  type: "base" | "heading";
}

// :: Object
// [Specs](#model.NodeSpec) for the nodes defined in this schema.
export const nodes = {
  // :: NodeSpec The top level document node.
  doc: {
    content: "block+",
  },

  // :: NodeSpec A plain paragraph textblock. Represented in the DOM
  // as a `<p>` element.
  paragraph: {
    content: "inline*",
    attrs: { type: { default: "base" } },
    group: "block",
    parseDOM: [{ tag: "p" }],
    toDOM() {
      return ["p", 0] as const;
    },
  },

  // :: NodeSpec The text node.
  text: {
    group: "inline",
  },
};

// :: Object [Specs](#model.MarkSpec) for the marks in the schema.
export const marks = {
  italic: {
    parseDOM: [
      { tag: "i" },
      { tag: "em" },
      { style: "font-style", getAttrs: (value) => value == "italic" && null },
    ],
    toDOM(): ["em"] {
      return ["em"];
    },
  },

  bold: {
    parseDOM: [
      { tag: "b" },
      { tag: "strong" },
      {
        style: "font-weight",
        getAttrs: (value) => /^(bold(er)?|[5-9]\d{2,})$/.test(value) && null,
      },
    ],
    toDOM(): ["strong"] {
      return ["strong"];
    },
  },
  code: {
    parseDOM: [{ tag: "code" }],
    toDOM(): ["code"] {
      return ["code"];
    },
  },
};

// :: Schema
// This schema roughly corresponds to the document schema used by
// [CommonMark](http://commonmark.org/), minus the list elements,
// which are defined in the [`prosemirror-schema-list`](#schema-list)
// module.
//
// To reuse elements from this schema, extend or read from its
// `spec.nodes` and `spec.marks` [properties](#model.Schema.spec).
export const schema = new Schema({ nodes, marks } as const);
