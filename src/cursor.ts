import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { main } from "./index";
import { schema } from "./schema";

// A cursor class to handle repositioning and deactivation timeouts
class Cursor {
  #selectionType: "cursor" | "text";
  #anchorEl: HTMLDivElement;
  #headEl: HTMLDivElement;
  #cursorTimeout = 10000;
  #cursorTimeoutFn: number = 0;

  constructor() {
    this.#anchorEl = document.createElement("div");
    this.#anchorEl.classList.add("cursor", "anchor");
    this.#headEl = document.createElement("div");
    this.#headEl.classList.add("cursor", "head");
    this.#selectionType = "cursor";
    // this.#headEl.style.display = "none";
    main.appendChild(this.#anchorEl);
    main.appendChild(this.#headEl);
  }

  activate(): Cursor {
    this.#headEl.classList.remove("inactive");
    this.#anchorEl.classList.remove("inactive");
    return this;
  }

  deactivate(): Cursor {
    this.#headEl.classList.add("inactive");
    this.#anchorEl.classList.add("inactive");
    return this;
  }

  resetTimeout(): Cursor {
    this.activate();
    clearTimeout(this.#cursorTimeoutFn);
    this.#cursorTimeoutFn = setTimeout(
      () => this.deactivate(),
      this.#cursorTimeout
    );
    return this;
  }

  // In viewport coordinates
  repositionAnchor(x: number, y: number): Cursor {
    this.#anchorEl.style.transform = `translate(${x - 2}px, ${
      window.scrollY + y
    }px)`;
    return this;
  }

  // In viewport coordinates
  repositionHead(x: number, y: number): Cursor {
    this.#headEl.style.transform = `translate(${x - 2}px, ${
      window.scrollY + y
    }px)`;
    return this;
  }

  repositionToCoords(x: number, y: number): Cursor {
    return this.repositionAnchor(x, y).repositionHead(x, y);
  }

  reposition(view: EditorView<typeof schema>): Cursor {
    const isCursorSelection =
      view.state.selection.head === view.state.selection.anchor;
    // If you do an all selection, the anchor gets set to 0...for some reason :/
    if (isCursorSelection) {
      const anchorPosition = Math.max(view.state.selection.anchor, 1);
      const anchorCoords = view.coordsAtPos(anchorPosition);
      this.repositionToCoords(anchorCoords.right, anchorCoords.top);
      if (this.#selectionType === "text") {
        this.#anchorEl.classList.remove("split");
        this.#headEl.classList.remove("split");
        this.#selectionType = "cursor";
      }
    } else {
      if (this.#selectionType === "cursor") {
        this.#anchorEl.classList.add("split");
        this.#headEl.classList.add("split");
        this.#selectionType = "text";
      }
      // highlight selection
      const anchorPosition = Math.max(view.state.selection.anchor, 1);
      const headPosition = Math.min(
        view.state.selection.head,
        // This is the last position in the document
        view.state.doc.nodeSize - 3
      );
      if (anchorPosition > headPosition) {
        this.#anchorEl.classList.add("right");
        this.#headEl.classList.remove("right");
        this.#anchorEl.classList.remove("left");
        this.#headEl.classList.add("left");
      } else {
        this.#anchorEl.classList.add("left");
        this.#headEl.classList.remove("left");
        this.#anchorEl.classList.remove("right");
        this.#headEl.classList.add("right");
      }
      const anchorCoords = view.coordsAtPos(anchorPosition);
      this.repositionAnchor(anchorCoords.right, anchorCoords.top);

      const headCoords = view.coordsAtPos(headPosition);
      this.repositionHead(headCoords.right, headCoords.top);
    }

    return this;
  }
}

export const CursorPlugin = new Plugin<void, typeof schema>({
  key: new PluginKey("cursor"),
  view: (view) => {
    const cursor = new Cursor();
    window.addEventListener("resize", () => {
      cursor.reposition(view);
    });

    view.root.addEventListener("focus", () => cursor.resetTimeout(), true);
    view.root.addEventListener("blur", () => cursor.deactivate(), true);

    cursor.reposition(view);
    return {
      update: (view) => {
        cursor.resetTimeout();
        cursor.reposition(view);
      },
    };
  },
});
