import React, { useCallback, useState } from 'react';
import { WebView, WebViewMessageEvent } from 'react-native-webview';

export default function AutoHeightWebView({uri}: {uri: string}) {
  const [webViewHeight, setWebViewHeight] = useState<number>(500);

  const onWebViewMessage = useCallback((event: WebViewMessageEvent) => {
    const height = Number(event.nativeEvent.data);
    if (!isNaN(height)) {
      setWebViewHeight(height);
    }
  }, []);

  const webViewScript = `
    setTimeout(function() {
      const height = document.documentElement.scrollHeight;
      window.ReactNativeWebView.postMessage(height);
    }, 500);
    true;
  `;

  return (
    <WebView
      style={{ height: webViewHeight }}
      source={{ uri: uri }}
      onMessage={onWebViewMessage}
      injectedJavaScript={webViewScript}
      javaScriptEnabled={true}
      scalesPageToFit={true}
      scrollEnabled={true}
    />
  );
};
