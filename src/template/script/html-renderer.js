'use strict';

const React = require('react');
const renderHTML = require('react-render-html');
const SocketClient = require('./socket-client');

let HTMLRenderer = React.createClass({
  getInitialState() {
    return {html: ''};
  },
  componentDidMount() {
    this.socketClient = new SocketClient(this.props.location);
    this.socketClient.onData(this.handleData);
  },
  componentDidUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  },
  handleData(data) {
    this.setState({html: data});
  },
  render() {
    return React.createElement('div', null, renderHTML(this.state.html));
  }
});

module.exports = React.createFactory(HTMLRenderer);
