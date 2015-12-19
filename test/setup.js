'use strict';

const jsdom = require('jsdom');

// test setup for browser mocking
global.document = jsdom.jsdom('<!doctype html><html><body></body></html>');
global.window = global.document.defaultView;
global.navigator = {userAgent: 'node.js'};
