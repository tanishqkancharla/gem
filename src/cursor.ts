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
    this.#cursorTimeoutFn = setTimeout(
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

  repositionToViewHead(view: EditorView) {
    // Note: If you do an all selection, the anchor gets set to the last position in the document
    // which may be a location after the last block, so we reposition it to a location inside the last text block
    const coords = view.coordsAtPos(Math.min(view.state.selection.head, view.state.doc.nodeSize - 3));
    this.reposition(coords.right, coords.top);
  }
}
