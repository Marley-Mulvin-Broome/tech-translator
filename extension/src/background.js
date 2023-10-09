'use strict';

// With background scripts you can communicate with popup
// and contentScript files.
// For more information on background script,
// See https://developer.chrome.com/extensions/background_pages
chrome.runtime.onInstalled.addListener(function(){
  chrome.contextMenus.create({
    id: "saveWord",
    title: "単語を記録",
    contexts: ["selection"],
  });
});

// メッセージを受け取った時の処理
chrome.runtime.onMessage.addListener(function(request, sender, sendResponse) {
  if (request.action === "showPopup") {
    const selectedText = request.selectedText;
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
      if (selectedText) {
        const activeTab = tabs[0];
        const tabUrl = activeTab.url;

        // ポップアップを表示
        chrome.windows.create({
          url: "save_word.html?english=" + encodeURIComponent(selectedText) + "&url=" + tabUrl,
          type: "popup",
          width: 350,
          height: 500,
          left: 500,
          top: 300
        });
      }
    });
  }
});

// コンテキストメニューがクリックされた時の処理
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log(tab);
  if (info.menuItemId === "saveWord") {
    let word = info.selectionText;
    chrome.windows.create({
      url: "save_word.html?english=" + encodeURIComponent(word) + "&url=" + tab.url,
      type: "popup",
      width: 350,
      height: 500, 
      left: 500,
      top: 300
    });
  }
});
