// Non-js dependencies
import 'github-markdown-css/github-markdown.css';
import './style.css';

import ReactDOM from 'react-dom';
import HTMLRenderer from './html-renderer';

const app = global.document.getElementById('app');
ReactDOM.render(HTMLRenderer({location: global.window.location}), app);
