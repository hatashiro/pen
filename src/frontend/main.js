// Non-js dependencies
import "github-markdown-css/github-markdown.css";
import "highlight.js/styles/foundation.css";
import "./style.css";

import React from "react";
import ReactDOM from "react-dom";
import HTMLRenderer from "./html-renderer";

const app = document.createElement("div");
app.setAttribute("id", "app");
app.setAttribute("class", "markdown-body");
document.body.appendChild(app);

// Set title to Markdown filename
const pathTokens = location.pathname.split("/");
document.title = pathTokens[pathTokens.length - 1];

ReactDOM.render(React.createElement(HTMLRenderer, { location }), app);
