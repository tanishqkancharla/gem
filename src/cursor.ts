import { Plugin, PluginKey } from "prosemirror-state";
import { EditorView } from "prosemirror-view";
import { main } from "./index";
import { schema } from "./schema";

// A cursor class to handle repositioning and deactivation timeouts
class Cursor {
  #el: HTMLDivElement;
  #cursorTimeout = 10000;
  #cursorTimeoutFn: number = 0;

  constructor() {
    this.#el = document.createElement("div");
    this.#el.classList.add("cursor");
    main.appendChild(this.#el);
  }

  activate(): Cursor {
    this.#el.classList.remove("inactive");
    return this;
  }

  deactivate(): Cursor {
    this.#el.classList.add("inactive");
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
  reposition(x: number, y: number): Cursor {
    this.#el.style.transform = `translate(${x - 2}px, ${window.scrollY + y}px)`;
    return this;
  }

  repositionToViewAnchor(view: EditorView): Cursor {
    // If you do an all selection, the anchor gets set to 0...for some reason :/
    const coords = view.coordsAtPos(Math.max(view.state.selection.anchor, 1));
    this.reposition(coords.right, coords.top);
    return this;
  }
}

export const CursorPlugin = new Plugin<void, typeof schema>({
  key: new PluginKey("cursor"),
  view: (view) => {
    const cursor = new Cursor();
    window.addEventListener("resize", () => {
      cursor.repositionToViewAnchor(view);
    });
    view.root.addEventListener("focus", () => cursor.resetTimeout(), true);

    view.root.addEventListener("blur", () => cursor.deactivate(), true);
    cursor.repositionToViewAnchor(view);
    return {
      update: (view) => {
        cursor.resetTimeout();
        cursor.repositionToViewAnchor(view);
      },
    };
  },
});
