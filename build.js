#!/usr/bin/env node
const { build } = require("estrella");

build({
  entry: ["./src/index.ts", "./src/style.css"],
  outdir: "dist",
  loader: {
    ".ttf": "file",
  },
  bundle: true,
  minify: true,
});
