![Dark black card with centered text "Editor" set in striking green](public/card.png)

A performant and simple plain text editor, created with Prosemirror. The design is very inpsired by Paco Coursey's ["Writer"](https://github.com/pacocoursey/writer). "Very inspired" meaning basically identical to, lol.

Editor is fairly light-weight, coming in at around 64.5 kB. Much of that is Prosemirror, of which chunks of it can be rewritten/removed for this use-case. The js source itself is only about 100 lines. Editor is also accessible and semantic.

To run: `npm run dev`. It copies the public directory into `dist` and uses esbuild to bundle the js.

Please hit me up on [twitter](https://twitter.com/moonriseTK) if you like it or wanna see something added!

To do (in priority):

- Selection (double click for sentence, triple for paragraph).
- Cursor fades and disappears after a while of inactivity?
- Mobile selection isn't correctly set.
- Default word-selection (when you start highlighting, it defaults to selecting the whole word your cursor is on).
- Basic markdown through Prosemirror marks. Don't remove formatting (WYSIWYG), just style it with the formatting.
- Fix sentence-wrapping bug where it overflows sometimes (unreproducible as of yet).
- "Bookmarks" to leave your cursor in a position and travel back to.
- Allow theming/setting the color variables in UI?
- Potentially replace prosemirror-view to be more lightweight and integrate cursor and selection "natively".
