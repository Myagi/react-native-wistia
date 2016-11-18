/**
 * @providesModule Wistia
 * @flow
 */
import React from 'react';
import {
  StyleSheet
} from 'react-native';
import WebViewBridge from 'react-native-webview-bridge';

import getPlayerHTML from './player-html';


export default class Wistia extends React.Component {

  static propTypes = {
    videoId: React.PropTypes.string.isRequired,
    onReady: React.PropTypes.func,
    onPlay: React.PropTypes.func,
    onEnd: React.PropTypes.func,
    // `baseUrl` determines where the webview says
    // the video is playing from.
    baseUrl: React.PropTypes.string
  }

  constructor() {
    super();
    this.handlers = {};
    this.state = {
      ready: false
    };
  }

  componentDidMount() {
    this.registerHandlers();
  }

  componentWillReceiveProps() {
    this.registerHandlers();
  }

  registerHandlers() {
    this.registerBridgeEventHandler('ready', this.onReady);
    this.registerBridgeEventHandler('play', this.props.onPlay);
    this.registerBridgeEventHandler('end', this.props.onEnd);
  }

  registerBridgeEventHandler(eventName, handler) {
    this.handlers[eventName] = handler;
  }

  onBridgeMessage = (message) => {

    let payload;
    try {
      payload = JSON.parse(message);
    } catch (err) {
      return;
    }
    let handler = this.handlers[payload.name];
    if (handler) handler(payload.data);
  }

  onReady = () => {
    this.setState({ready: true});
    // Defer calling `this.props.onReady`. This ensures 
    // that `this.state.ready` will be updated to
    // `true` by the time it is called.
    if (this.props.onReady) setTimeout(this.props.onReady);
  }

  api = (method, cb) => {
    if (!this.state.ready) {
      throw new Error('You cannot use the `api` method until `onReady` has been called');
    }
    this.refs.webviewBridge.sendToBridge(method);
    this.registerBridgeEventHandler(method, cb);
  }

  render() {
    const html = getPlayerHTML(this.props.videoId);
    return (
      <WebViewBridge
        ref='webviewBridge'
        source={{ html: html, baseUrl: this.props.baseUrl }}
        style={{
          marginTop: -8,
          marginLeft: -10,
          height: this.props.height
        }}
        scalesPageToFit={false}
        scrollEnabled={false}
        onBridgeMessage={this.onBridgeMessage}
        onError={(error)=> console.error(error)}
      />
    );
  }

}
