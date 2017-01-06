'use strict';

// Non-js dependencies
require('github-markdown-css/github-markdown.css');
require('./style.css');

const HTMLRenderer = require('./html-renderer');
const ReactDOM = require('react-dom');

const app = global.document.getElementById('app');
ReactDOM.render(HTMLRenderer({location: global.window.location}), app);
