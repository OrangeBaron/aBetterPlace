chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {

        const targetDomain = atob("cmFpcGVybWUuaW50cmFuZXQucmFpLml0");

        if (tab.url.includes(targetDomain)) {
            
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: ["src/inject/patch.js"],
                world: "MAIN" 
            })
            .then(() => console.log("Patch injected."))
            .catch(err => console.error("Patch injection failed:", err));

            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: [
                    "src/inject/utils.js",
                    "src/inject/modules/form-handler.js",
                    "src/inject/modules/dialog-handler.js",
                    "src/inject/modules/layout-handler.js",
                    "src/inject/modules/date-nav.js",
                    "src/inject/updater.js",
                    "src/inject/modules/logo-handler.js",
                    "src/inject/main.js"
                ]
            })
            .then(() => console.log("System injected."))
            .catch(err => console.error("System injection failed:", err));
        }
    }
});
