chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {

        const targetDomain = atob("cmFpcGVybWUuaW50cmFuZXQucmFpLml0");

        if (tab.url.includes(targetDomain)) {
            
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["patch.js"],
                world: "MAIN" 
            })
            .then(() => console.log("Patch injected."))
            .catch(err => console.error("Patch injection failed:", err));

            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: [
                    "utils.js",
                    "form-handler.js",
                    "dialog-handler.js",
                    "layout-handler.js",
                    "date-nav.js",
                    "updater.js",
                    "logo-handler.js",
                    "main.js"
                ]
            })
            .then(() => console.log("System injected."))
            .catch(err => console.error("System injection failed:", err));
        }
    }
});