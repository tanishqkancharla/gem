#!/usr/bin/env node
const { build } = require("estrella");

build({
	entry: ["./src/index.tsx", "./src/style.css"],
	outdir: "dist",
	bundle: true,
	minify: true,
});
