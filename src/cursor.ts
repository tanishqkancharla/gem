import { EditorView } from "prosemirror-view";
import { main } from "./index";

// A cursor class to handle repositioning and deactivation timeouts
export class Cursor {
  #el: HTMLDivElement;
  #cursorTimeout = 10000;
  #cursorTimeoutFn: number = 0;

  constructor() {
    this.#el = document.createElement("div");
    this.#el.classList.add("cursor");
    main.appendChild(this.#el);
  }

  activate() {
    this.#el.classList.remove("inactive");
  }

  deactivate() {
    this.#el.classList.add("inactive");
  }

  resetTimeout() {
    this.activate();
    clearTimeout(this.#cursorTimeoutFn);
    this.#cursorTimeoutFn = window.setTimeout(
      () => this.deactivate(),
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
    // If you do an all selection, the anchor gets set to 0...for some reason :/
    const coords = view.coordsAtPos(Math.max(view.state.selection.anchor, 1));
    this.reposition(coords.right, coords.top);
  }
}
