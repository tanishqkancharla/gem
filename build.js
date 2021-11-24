#!/usr/bin/env node
const { build } = require("estrella");

build({
  entry: ["./src/index.ts", "./src/style.css"],
  outdir: "dist",
  bundle: true,
  define: {
    TEST: true,
  },
  minify: true,
});
