# React Native Wistia Player

It is easy enough to embed Wistia videos in your React Native app using a standard
React Native Webview, however it is impossible to access the Wistia player API that way.
This component allows you to easily embed a Wistia video in your app and have full access to
the Wistia player JS API (documented at https://wistia.com/doc/player-api).

## Installation

1. Go through the instructions for installing the
`React Native Webview Bridge` component, found here: https://github.com/alinz/react-native-webview-bridge.

2. Run `npm install react-native-wistia` within your project.

3. Compile and build to make sure everything is set up properly.

## Usage

```
  <Wistia
    ref='video'
    videoId='2619976' // Wistia video ID
    onReady={ () => console.log('Video is ready') }
    onPlay={ () => console.log('Video is playing') }
    onEnd={ () => console.log('Video is finished') }
  />
```

`this.refs.video.api('duration', dur => console.log('Video duration is:', dur))`

NOTE: Any `api` method calls must be made after `onReady` has been called.
