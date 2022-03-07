chrome.runtime.onMessage.addListener((message, sender) => {
    if ((message as BrowserMessage).type === 'ITEM_ADDED') {
        chrome.windows.remove(sender.tab.windowId);
        chrome.tabs.create({ url: sender.url });
    } else if ((message as BrowserMessage).type === 'CHOOSE_PAYMENT') {
        chrome.windows.remove(sender.tab.windowId);
        chrome.tabs.create({ url: (message as BrowserMessage).message });
    }
});