import { StateField } from "@codemirror/state";
import { EditorView, ViewPlugin, ViewUpdate } from "@codemirror/view";
import { main } from "./index";

// A cursor class to handle repositioning and deactivation timeouts
export const cursorPlugin = ViewPlugin.fromClass(
  class Cursor {
    #el: HTMLDivElement;
    #cursorTimeout = 10000;
    #cursorTimeoutFn: number = 0;

    constructor(view: EditorView) {
      this.#el = document.createElement("div");
      this.#el.classList.add("cursor");
      main.appendChild(this.#el);

      window.addEventListener("resize", () => {
        this.repositionToViewAnchor(view);
      });

      view.dom.addEventListener("focus", () => this.resetTimeout(), true);

      view.dom.addEventListener("blur", () => this.deactivate(), true);
    }

    update(update: ViewUpdate) {
      this.resetTimeout();
      this.repositionToViewAnchor(update.view);
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

    repositionToViewAnchor(view: EditorView) {
      const cursor = this;
      view.requestMeasure({
        read: (view) => {
          // If you do an all selection, the anchor gets set to 0...for some reason :/
          const coords = view.coordsAtPos(view.state.selection.ranges[0].head);
          if (coords) {
            cursor.reposition(coords.right, coords.top);
          }
        },
      });
    }
  }
);
