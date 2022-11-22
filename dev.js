#!/usr/bin/env node
const { build } = require("estrella");

build({
	entry: ["./src/index.tsx", "./src/style.css"],
	outdir: "dist",
	watch: true,
	bundle: true,
	tslint: "on",
	sourcemap: "inline",
	sourcesContent: true,
	minify: false,
	run: "npx serve -n -l 3000",
});
