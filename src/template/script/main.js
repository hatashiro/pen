// Non-js dependencies
import 'github-markdown-css/github-markdown.css';
import './style.css';

import React from 'react';
import ReactDOM from 'react-dom';
import HTMLRenderer from './html-renderer';

ReactDOM.render(
  React.createElement(HTMLRenderer, { location }),
  document.getElementById('app')
);
