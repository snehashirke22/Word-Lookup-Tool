chrome.runtime.onInstalled.addListener(() => {
    // Create context menu item
    chrome.contextMenus.create({
        id: "lookup",
        title: "Lookup Word",
        contexts: ["selection"]
    });
});

// Handle context menu clicks
chrome.contextMenus.onClicked.addListener((info, tab) => {
    if (info.menuItemId === "lookup" && info.selectionText) {
        // Store the selected word
        chrome.storage.local.set({ selectedWord: info.selectionText }, () => {
            // Create popup window
            chrome.windows.create({
                url: chrome.runtime.getURL("index.html"),
                type: "popup",
                width: 400,
                height: 350,
                top: 100,
                left: 100,
            });
        });
    }
});
