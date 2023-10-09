'use strict';

// Content script file will run in the context of web page.
// With content script you can manipulate the web pages using
// Document Object Model (DOM).
// You can also pass information to the parent extension.

// We execute this script by making an entry in manifest.json file
// under `content_scripts` property

// For more information on Content Scripts,
// See https://developer.chrome.com/extensions/content_scripts

// Log `title` of current active web page
const pageTitle = document.head.getElementsByTagName('title')[0].innerHTML;
console.log(
  `Page title is: '${pageTitle}' - evaluated by Chrome extension's 'contentScript.js' file`
);

// Communicate with background file by sending a message
chrome.runtime.sendMessage(
  {
    type: 'GREETINGS',
    payload: {
      message: 'Hello, my name is Con. I am from ContentScript.',
    },
  },
  response => {
    console.log(response.message);
  }
);

// Listen for message
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "getSelectedTextAndUrl") {
      const selectedText = window.getSelection().toString();
      const tabUrl = sender.tab.url;

      sendResponse({ selectedText: selectedText, tabUrl: tabUrl });
  }
});
// コンテンツスクリプト

function contentScriptClickHandler(e) {
  if (!e.ctrlKey)
  {
    return;
  }
  const selectedText = window.getSelection().toString();
  console.log(selectedText);
  chrome.runtime.sendMessage({ action: "showPopup", selectedText: selectedText });
}

document.addEventListener('keydown', function(event) {
  const isCtrlPressed = event.ctrlKey;
  const isShiftPressed = event.shiftKey;
  const isAltPressed = event.altKey;

  if (isCtrlPressed && isShiftPressed && isAltPressed) {
    const selectedText = window.getSelection().toString();
    console.log(selectedText);
    chrome.runtime.sendMessage({ action: "showPopup", selectedText: selectedText });
  }
});

document.addEventListener("click", function(e) {
  console.log(e.ctrlKey || e.metaKey);
  console.log(e.ctrlKey);
  console.log(e.metaKey);
  if ((e.ctrlKey || e.metaKey))
  {
    const selectedText = window.getSelection().toString();
    console.log(selectedText);
    chrome.runtime.sendMessage({ action: "showPopup", selectedText: selectedText });
  }
});