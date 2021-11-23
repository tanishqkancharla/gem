#!/usr/bin/env node
const { build } = require("estrella");

build({
  entry: ["./src/index.ts", "./src/style.css"],
  outdir: "dist",
  watch: true,
  bundle: true,
  sourcemap: true,
  minify: false,
  run: "npx serve -l 3000 dist",
});
