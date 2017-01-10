import React from 'react';
import renderHTML from 'react-render-html';
import SocketClient from './socket-client';

const HTMLRenderer = React.createClass({
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

export default React.createFactory(HTMLRenderer);
