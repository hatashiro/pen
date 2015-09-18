'use strict';

const HTMLRenderer = require('./html-renderer');

let renderer = new HTMLRenderer(global.location);
renderer.renderTo(global.document.getElementById('app'));
