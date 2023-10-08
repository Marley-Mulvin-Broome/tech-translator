'use strict';

import WordTranslator from "./components/wordTranslator";

// wordTranslatorコンポーネントの読み込み
const wordTranslator = WordTranslator();


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
  if (!e.ctrlKey)
  {
    return;
  }
  const selectedText = window.getSelection().toString();
  console.log(selectedText);
  chrome.runtime.sendMessage({ action: "showPopup", selectedText: selectedText });
});