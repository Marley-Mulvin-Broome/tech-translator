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
chrome.contextMenus.onClicked.addListener(function(info, tab) {
  console.log(tab);
  if (info.menuItemId === "saveWord") {
    let word = info.selectionText;  // 選択文字列を取得する
    chrome.windows.create({
      url: "save_word.html?english=" + encodeURIComponent(word) + "&url=" + tab.url,
      type: "popup",
      width: 400,
      height: 300, 
      left: 500,
      top: 300
    });
  }
});

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.type === 'GREETINGS') {
    const message = `Hi ${
      sender.tab ? 'Con' : 'Pop'
    }, my name is Bac. I am from Background. It's great to hear from you.`;

    // Log message coming from the `request` parameter
    console.log(request.payload.message);
    // Send a response message
    sendResponse({
      message,
    });
  }
});
