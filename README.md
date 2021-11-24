![Dark black card with sample white text illustrating basic markup](public/example.png)

Gem (previously called Editor) is a performant and simple plain text editor, created with Prosemirror. The design is very inpsired by Paco Coursey's ["Writer"](https://github.com/pacocoursey/writer).

The goods:

- Fairly lightweight, around 65.5 kB for the whole website.
  - Can do a fair bit better here...some of the prosemirror modules can be stripped for this purpose.
- Undo/redo.
- Arrow key movement.
- Basic inline markdown (bold, code, italic), although they can be a little buggy.
- JS source is small and readable.
- CSS source is small and readable. Uses CSS variables for styling.
- Accessible and semantic. Each paragraph becomes a `p` tag, each inline style is appropriately represented.
- Playful animated cursor :)

To run: `npm run dev`. The build step uses `estrella` to bundle/watch and `serve` for serving.

Please hit me up on [twitter](https://twitter.com/moonriseTK) if you like it or have any ideas for features!

To do (in priority):

- Add performance testing so every transaction is dispatched in prosemirror within 1 frame (16 ms). Editing should be 60 fps
- Basic markdown through Prosemirror marks. Don't remove formatting (WYSIWYG), just style it with the formatting. Just attach attributes to the para tag instead of actually making different blocks. That'll make things easier.
  - Headings
  - Bullet lists
  - Numbered lists
  - Code block
- Code block syntax highlighting (async loading through prismjs?)
- Cursor shape changes when marks are applied (fatter when bold, slant when italic, rectangle when code)
- Default word-selection (when you start highlighting, it defaults to selecting the whole word your cursor is on).
- Fix sentence-wrapping bug where it overflows sometimes (unreproducible as of yet, unless you paste in a huge text).
- Highlight and animate selection through 3 divs: one on bottom to beginning of line, one sandwiched in b/w, and one from top to end of line
- "Bookmarks" to leave your cursor in a position and travel back to.

Things I'm thinking of adding:

- Table of contents generated from the headings for easy navigation?
- Tree-sitter for incremental markdown parsing? Prosemirror plugin to wrap the wasm bundle?
- Allow theming/setting the color variables in UI?
- Potentially replace prosemirror-view to be more lightweight and integrate cursor and selection "natively"?
- Share urls to save?
