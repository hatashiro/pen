import React from 'react';
import renderHTML from 'react-render-html';
import SocketClient from './socket-client';

class HTMLRenderer extends React.Component {
  constructor(props) {
    super(props);
    this.state = { html: '' };
  }
  componentDidMount() {
    this.socketClient = new SocketClient(this.props.location);
    this.socketClient.onData(html => this.setState({ html }));
  }
  componentDidUpdate() {
    if (this.props.onUpdate) {
      this.props.onUpdate();
    }
  }
  render() {
    return React.createElement('div', null, renderHTML(this.state.html));
  }
}

HTMLRenderer.propTypes = {
  location: React.PropTypes.shape({
    host: React.PropTypes.string.isRequired,
    pathname: React.PropTypes.string.isRequired,
  }).isRequired,
  onUpdate: React.PropTypes.func,
};

export default HTMLRenderer;
