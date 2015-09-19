<img src='media/logo.png' width='200'>

# [![GitHub license](https://img.shields.io/badge/license-MIT-lightgrey.svg?style=flat-square)](LICENSE) [![npm](https://img.shields.io/npm/v/npm.svg?style=flat-square)]() [![travis](https://img.shields.io/travis/noraesae/pen.svg?style=flat-square)](https://travis-ci.org/noraesae/pen)

> We need a better Markdown previewer.

## What is `pen`?

`pen` is a Markdown previewer written in JavaScript, aiming to *just work*.

There are literally tons of Markdown previewers out there. I love some of them,
I even made [one](https://github.com/noraesae/orange-cat) of them. Nevertheless,
we always need a better one, don't we?

Using `pen` is super simple, we don't need to install any special editor or
launch any GUI application. `pen` is just a tidy command-line tool. You can use
your favourite editor and browser. No manual refresh is even needed.

I personally use `pen` everyday, and I hope you love it too. :black_nib:

## Demo

![demo](https://cloud.githubusercontent.com/assets/1013641/9977359/21b79f66-5f3f-11e5-860a-cf19b2287009.gif)

## Requirement

`pen` uses [Node.js >= 4.0](https://nodejs.org/en/docs/es6/). It may not work
on earlier versions.

## Install

Using [npm](http://npmjs.com):

```
npm install -g pen.md
```

## Usage

To use `pen`, simply run the `pen` command.

```
pen README.md
```

The command above will launch a `pen` server and open the file in your default
browser. The server will listen to a 6060 port by default. To be honest, you
don't even need to launch it with a filename. You can manually open
http://localhost:6060/README.md, or any other files in the same directory.

To stop the server, enter `^C`.

For the further details of the `pen` command, please enter `pen -h` or `pen
--help`.

## Development

I welcome every contribution on `pen`. You may start from forking and cloning
this repo.

```
git clone git@github.com:your_username/pen.git
```

To build frontend scripts using [Webpack](http://webpack.github.io):
```
npm run build
```

To lint with [ESLint](http://eslint.org):
```
npm run lint
```

To test with [Mocha](http://mochajs.org)
```
npm test
```

## TODOs

- [ ] Incremental update using virtual DOM or React

## License

Pen is released under the [MIT License](LICENSE).
