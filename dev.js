#!/usr/bin/env node
const { build } = require("estrella");

build({
  entry: ["./src/index.ts", "./src/style.css"],
  outdir: "dist",
  watch: true,
  bundle: true,
  tslint: "on",
  sourcemap: "inline",
  minify: false,
  run: "npx serve -n -l 3000 dist",
});
