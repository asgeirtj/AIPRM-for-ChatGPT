// Remember prompt to prefill
let prefillPrompt = '';

// Unregister service worker to prevent caching of API requests and to avoid defects in the extension
navigator.serviceWorker.getRegistrations().then(function (registrations) {
  for (let registration of registrations) {
    registration.unregister();
  }
});

function injectStyle(file) {
  var link = document.createElement('link');
  link.href = chrome.runtime.getURL(file);
  link.type = 'text/css';
  link.rel = 'stylesheet';
  link.media = 'all';
  document.getElementsByTagName('HEAD')[0].appendChild(link);
}

injectStyle('style.css');

function injectScript(file, node, module = true) {
  var th = document.getElementsByTagName(node)[0];
  var s = document.createElement('script');
  s.setAttribute('type', 'text/javascript');
  s.setAttribute('src', file);

  if (module) {
    s.setAttribute('type', 'module');
  }

  th.appendChild(s);
}

injectScript(chrome.runtime.getURL('inject.js'), 'body');

injectScript(chrome.runtime.getURL('readability.js'), 'body', false);

// open a port to the background script
let port = connectPort();

// list for tab messages from the background script
chrome.runtime.onMessage.addListener(function (request, sender, sendResponse) {
  if (request.type === 'AIPRM.prompt') {
    // save the prefill prompt
    prefillPrompt = request.prompt;

    sendResponse({ success: true });
  }
});

// listen for messages from the inject script
window.addEventListener('message', function (event) {
  // only accept messages from the inject script
  if (event.source !== window) {
    return;
  }

  // only accept messages that have our prefix data.from = AIPRM
  if (event.data.from !== 'AIPRM') {
    return;
  }

  // if the message is to get the prefill prompt & we have a prefill prompt, dispatch a custom event
  if (event.data?.data?.type === 'AIPRM.prefillPrompt' && prefillPrompt) {
    document.dispatchEvent(
      new CustomEvent('AIPRM.prompt', { detail: { prompt: prefillPrompt } })
    );

    // clear the prefill prompt
    prefillPrompt = '';

    return;
  }

  // send message to the background script
  try {
    port.postMessage(event.data);
  } catch (e) {
    // if the port is disconnected, reconnect and send the message
    port = connectPort();
    port.postMessage(event.data);
  }
});

// open a port to the background script
function connectPort() {
  let port;

  try {
    port = chrome.runtime.connect({ name: 'AIPRM' });
  } catch (e) {
    console.error('Error connecting to background script:', e);
    return;
  }

  // listen for messages from the background script
  port.onMessage.addListener((message) => {
    // if the message contains tokens, dispatch a custom event
    if (message.type === 'tokens') {
      document.dispatchEvent(
        new CustomEvent('AIPRM.tokens', { detail: { tokens: message.tokens } })
      );
    }
  });

  // attempt to reconnect if the port is disconnected
  port.onDisconnect.addListener(() => {
    // Delay reconnection by 1 second
    setTimeout(connectPort, 1000);
  });

  return port;
}
