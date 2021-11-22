![Dark black card with sample white text illustrating basic markup](public/example.png)

A performant and simple plain text editor, created with Prosemirror. The design is very inpsired by Paco Coursey's ["Writer"](https://github.com/pacocoursey/writer).

The goods:

- Fairly lightweight, around 64.5 kB for the whole website.
- JS source is small and readable.
- CSS source is small and readable. Uses CSS variables for styling.
- Accessible and semantic
- Undo/redo
- Pretty (at least I think so, lol)

To run: `npm run dev`. It copies the public directory into `dist` and uses esbuild to bundle the js.

Please hit me up on [twitter](https://twitter.com/moonriseTK) if you like it or wanna see something added!

To do (in priority):

- Basic markdown through Prosemirror marks. Don't remove formatting (WYSIWYG), just style it with the formatting.
- Cursor shape changes when marks are applied (fatter when bold, slant when italic)
- Cursor fades and disappears after a while of inactivity?
- Default word-selection (when you start highlighting, it defaults to selecting the whole word your cursor is on).
- Fix sentence-wrapping bug where it overflows sometimes (unreproducible as of yet).
- "Bookmarks" to leave your cursor in a position and travel back to.
- Allow theming/setting the color variables in UI?
- Potentially replace prosemirror-view to be more lightweight and integrate cursor and selection "natively".
