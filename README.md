<h1><img src='media/logo.png' alt='logo' width='200'/></h1>

> We need a better Markdown previewer.

[![travis](https://travis-ci.org/utatti/pen.svg)](https://travis-ci.org/utatti/pen)

`pen` is a Markdown previewer written in JavaScript, aiming to *just work*.

There are literally tons of Markdown previewers out there. I love some of them,
I even made [one](https://github.com/utatti/orange-cat) of them. Nevertheless,
we always need a better one, don't we?

Using `pen` is super simple, we don't need to install any special editor or
launch any GUI application. `pen` is just a tidy command-line tool. You can use
your favourite editor and browser. No manual refresh is even needed.

Also, the previewer renders the content using [React](https://facebook.github.io/react/).
It means that it will not re-render entire DOM when the document is updated.
This is a huge advantage because images or other media won't be reloaded for
the DOM update.

I personally love to use `pen`, and I hope you love it too. :black_nib:

## Demo

Here is a short demo showing how awesome `pen` is.

![demo](https://cloud.githubusercontent.com/assets/1013641/9977359/21b79f66-5f3f-11e5-860a-cf19b2287009.gif)

The following demo shows `pen` incrementally updates only modified part using
[React](https://facebook.github.io/react/) and
its [Virtual DOM](https://facebook.github.io/react/docs/glossary.html).

![virtual-dom](https://cloud.githubusercontent.com/assets/1013641/11914823/896591ba-a6cd-11e5-94ee-05e3ab50413b.gif)

## Requirement

`pen` uses [Node.js >= 4.0](https://nodejs.org/en/docs/es6/). It may not work
on earlier versions.

## Install

Using [npm](http://npmjs.com):

```shell
npm i -g pen
```

You can try using `pen` with `npx`:

```shell
npx pen
```

## Usage

To use `pen`, simply run the `pen` command.

```shell
pen README.md
```

The command above will launch a `pen` server and open the file in your default
browser. The server will listen to a 6060 port by default. To be honest, you
don't even need to launch it with a filename. You can manually open
http://localhost:6060/README.md, or any other files in the same directory.

To stop the server, enter `^C`.

For the further details of the `pen` command, please enter `pen -h` or `pen
--help`.

### Pandoc

Pen uses [markdown-it](https://github.com/markdown-it/markdown-it) as Markdown
parser by default, but it also supports Pandoc. Please provide [a proper Pandoc
format](http://pandoc.org/MANUAL.html#general-options) for the value.

```shell
pen --pandoc gfm README.md
```

## Contribution

I welcome every contribution on `pen`. You may start from forking and cloning
this repo.

```shell
git clone git@github.com:your_username/pen.git
cd pen

# Install dependencies
npm i

# Lint, build, and test pen codes at once
npm test
```

To build frontend scripts:

```shell
npm run build
```

To lint with [ESLint](http://eslint.org):

```shell
npm run lint
```

To test with [Mocha](http://mochajs.org)

```shell
npm run mocha
```

## License

Pen is released under the [MIT License](LICENSE).
