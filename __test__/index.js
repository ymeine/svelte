const fs = require('fs');
const util = require('util');
const compiler = require('../compiler');

const inspect = value => console.log(util.inspect(value, {colors: true, depth: null}));

const source = fs.readFileSync('Main.svelte', 'utf8');
// inspect(compiler.parse(source).html.children);
// inspect(compiler.compile(source));
console.log(compiler.compile(source).js.code);
