export default function (videoId, height) {
  return `
    <!DOCTYPE html>
    <html style="height: 100%; width: 100%;">

      <body style="height: 100%; width: 100%;">
        <script charset="ISO-8859-1" src="//fast.wistia.com/assets/external/E-v1.js" async></script>
        <div class="wistia_embed wistia_async_${videoId}" style="height: 100%; width:100%;">&nbsp;</div>
      </body>

      <script>

        function webViewBridgeReady(cb) {
         // Checks whether WebViewBridge exists in global scope.
         if (window.WebViewBridge) {
           cb(window.WebViewBridge);
           return;
         }

         function handler() {
           // Remove the handler from listener since we don't need it anymore
           document.removeEventListener('WebViewBridge', handler, false);
           // Pass the WebViewBridge object to the callback
           cb(window.WebViewBridge);
         }

         // If WebViewBridge doesn't exist in global scope attach itself to document
         // event system. Once the code is being injected by extension, the handler will
         // be called.
         document.addEventListener('WebViewBridge', handler, false);
       }

       webViewBridgeReady(function (webViewBridge) {

         window._wq = window._wq || [];
         window._wq.push({ "_all": function(player) {

           // Bind player events to 'sendEvent' function so that they are passed
           // through the bridge.
           // Ideally we could just iterate over event names and add the sendEvent
           // handler to each of them, however that doesn't work because sendEvent
           // ends up just being called with whatever was the last event in the array.

           player.bind('play', function(data) { sendEvent('play', data); });
           player.bind('end', function(data) { sendEvent('end', data); });

           sendEvent('ready');

           function sendEvent(evt, data) {
             // Passes events through the bridge
             var payload = {
               name: evt,
               data: data
             }
             webViewBridge.send(JSON.stringify(payload));
           }

         }});

       });

      </script>
    </html>
  `;
}
