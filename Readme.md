# mdast-usage [![Build Status](https://img.shields.io/travis/wooorm/mdast-usage.svg?style=flat)](https://travis-ci.org/wooorm/mdast-usage) [![Coverage Status](https://img.shields.io/coveralls/wooorm/mdast-usage.svg?style=flat)](https://coveralls.io/r/wooorm/mdast-usage?branch=master)

Add a [usage](#usage) example to a Readme.md.

## Installation

[npm](https://docs.npmjs.com/cli/install):

```bash
$ npm install mdast-usage
```

## Usage

This section is rendered by this module from [example.js](example.js).

Require dependencies:

```javascript
var fs = require('fs');
var mdast = require('mdast');
```

Require usage:

```javascript
/*
 * The below is changed because a require to the main
 * module file is detected.
 */
var usage = require('mdast-usage'); // This is changed from `./index.js` to `mdast-usage`
```

Read and parse `Readme.md`:

```javascript
var readme = fs.readFileSync('Readme.md', 'utf-8');
var ast = mdast.use(usage).parse(readme);
```

Log something with a language flag:

```markdown
Add a [usage](#usage) example to a Readme.md.
```

Or without language:

    ## Installation

Log something which is never captured:

```javascript
function neverCalled() {
    console.log('javascript', 'alert("test")');
}
```

Log something which isn’t captured because it’s not not a string.

```javascript
console.log(this);
```

## API

### [mdast](https://github.com/wooorm/mdast#api).[use](https://github.com/wooorm/mdast#mdastuseplugin)(mdastUsage)

Adds `example.js` to the `Usage` section in a `Readme.md`.

Removes the current content between the heading containing the text “usage”, and the next heading of the same (or higher) depth, and replaces it with the example.

The example is run as JavaScript. Line comments are parsed as Markdown. Calls to `console.log()` are exposed as code blocks, containing the logged values (optionally with a language flag).

It’s easiest to check out and compare [`example.js`](example.js) with the above [Usage](#usage) section.

- Operate this from an npm package, or provide a `cwd`;
- Make sure no side effect occur when running `example.js`!
- Don’t do crazy things. This is mostly regexes!

You can provide options to [`mdast.parse()`](https://github.com/wooorm/mdast#mdastparsevalue-options):

Options:

- `cwd` (string?) — Path to a directory containing a node module. Used to infer `name`, `main`, and `example`;
- `name` (string?) — Name of the module. Inferred from `package.json`s `name` property. Used to rewrite `require('./index.js')` to `require('some-name')`;
- `main` (string?) — Path to the main script. Resolved from `package.json`s `main` property (or `index.js`). Used to rewrite `require('./index.js')` to `require('some-name')`.
- `example` (string?) — Path to the example script. **mdast-usage** checks for `docs/example.js`, `doc/example.js`, `examples/index.js`, `example/index.js`, and `example.js`.

## CLI

Install:

```bash
$ npm install --global mdast-usage
```

Use:

```text
Usage: mdast-usage [options] [mdast options]

Add a usage example to your Readme

Options:

  -h, --help            output usage information
  -v, --version         output version number

A wrapper around `mdast --use mdast-usage`

Help for mdast:

  https://github.com/wooorm/mdast

Usage:

# Pass `Readme.md` through mdast-usage
$ mdast-usage Readme.md -o Readme.md

# Pass `Readme.md` through mdast-usage, with a custom name
$ mdast-usage Readme.md -o Readme.md --option name:42

# Pass stdin through mdast-usage, with mdast options, and write to stdout
$ cat Readme.md | mdast-usage --option setext > Readme-new.md

# Use other plugins
$ npm install some-plugin
$ cat Readme.md | mdast-usage --use some-plugin
```

## License

[MIT](LICENSE) © [Titus Wormer](http://wooorm.com)
