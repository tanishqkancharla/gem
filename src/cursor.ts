import { EditorView } from "prosemirror-view";
import { main } from "./index";

export class Cursor {
  #el: HTMLDivElement;
  #cursorTimeout = 10000;
  #cursorTimeoutFn: number;

  constructor() {
    this.#el = document.createElement("div");
    this.#el.classList.add("cursor");
    main.appendChild(this.#el);
  }

  resetTimeout() {
    this.#el.classList.remove("inactive");
    clearTimeout(this.#cursorTimeoutFn);
    const cursor = this;
    this.#cursorTimeoutFn = setTimeout(
      () => cursor.#el.classList.add("inactive"),
      this.#cursorTimeout
    );
  }

  // In viewport coordinates
  reposition(x: number, y: number) {
    this.#el.style.transform = `translate(${x - 2}px, ${
      window.scrollY + y - 4
    }px)`;
  }

  repositionToViewAnchor(view: EditorView) {
    const coords = view.coordsAtPos(view.state.selection.anchor);
    this.reposition(coords.right, coords.top);
  }
}
