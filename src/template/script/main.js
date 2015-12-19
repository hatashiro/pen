'use strict';

const HTMLRenderer = require('./html-renderer');
const ReactDOM = require('react-dom');

let app = global.document.getElementById('app');
ReactDOM.render(HTMLRenderer({location: global.window.location}), app);
