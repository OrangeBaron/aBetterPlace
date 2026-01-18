chrome.runtime.onInstalled.addListener(() => {
    chrome.storage.sync.get({ privacyMode: false }, (items) => {
        const ruleId = 'network_rules';
        if (items.privacyMode) {
            chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: [ruleId] });
        } else {
            chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: [ruleId] });
        }
    });
});

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {

        const targetDomain = atob("cmFpcGVybWUuaW50cmFuZXQucmFpLml0");
        
        const authDomain = atob("d3d3LnJhaXBsYWNlLnJhaS5pdC9kYW5hLW5hL2F1dGgv");

        // CASO 1: Portale Principale
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
                    "src/inject/modules/style-manager.js",
                    "src/inject/modules/ui-manager.js",
                    "src/inject/modules/form-handler.js",
                    "src/inject/modules/dialog-handler.js",
                    "src/inject/modules/layout-handler.js",
                    "src/inject/modules/date-nav.js",
                    "src/inject/modules/bookmark-handler.js",
                    "src/inject/updater.js",
                    "src/inject/modules/logo-handler.js",
                    "src/inject/main.js"
                ]
            })
            .then(() => console.log("System injected."))
            .catch(err => console.error("System injection failed:", err));
        
        // CASO 2: Portale Autenticazione
        } else if (tab.url.includes(authDomain)) {
            
            chrome.scripting.executeScript({
                target: { tabId: tabId },
                files: [
                    "src/inject/modules/otp-handler.js",
                    "src/inject/modules/session-handler.js"
                ]
            })
            .then(() => {
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: () => {
                        if (window.aBetterPlace && window.aBetterPlace.OtpHandler) {
                            window.aBetterPlace.OtpHandler.process();
                        }
                        if (window.aBetterPlace && window.aBetterPlace.SessionHandler) {
                            window.aBetterPlace.SessionHandler.process();
                        }
                    }
                });
                console.log("Auth modules injected.");
            })
            .catch(err => console.error("Auth injection failed:", err));
        }
    }
});