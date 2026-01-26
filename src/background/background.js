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
            
            // 1. Leggiamo le opzioni
            chrome.storage.sync.get({ bypassRestrictions: false, toastNotifications: true }, (items) => {

                // 2. Se l'opzione è attiva, iniettiamo il bypass
                if (items.bypassRestrictions) {
                    chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ["src/inject/modules/restrictions-bypass.js"],
                        world: "MAIN" 
                    })
                    .then(() => console.log("Restrictions Bypass injected."))
                    .catch(err => console.error("Bypass injection failed:", err));
                }

                // 3. Passiamo la preferenza dei toast
                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    func: (enabled) => { window.abpToastEnabled = enabled; },
                    args: [items.toastNotifications],
                    world: "MAIN"
                })
                .then(() => {
                    // Ora iniettiamo la patch
                    return chrome.scripting.executeScript({
                        target: { tabId: tabId },
                        files: ["src/inject/patch.js"],
                        world: "MAIN" 
                    });
                })
                .then(() => console.log("Patch injected."))
                .catch(err => console.error("Patch injection failed:", err));

                // 4. Procediamo con il resto del sistema
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
                        "src/inject/modules/the-place.js",
                        "src/inject/updater.js",
                        "src/inject/modules/logo-handler.js",
                        "src/inject/modules/settings-injector.js",
                        "src/inject/modules/flexibility-fix.js",
                        "src/inject/main.js"
                    ]
                })
                .then(() => console.log("System injected."))
                .catch(err => console.error("System injection failed:", err));
            });
        
        // CASO 2: Portale Autenticazione
        } else if (tab.url.includes(authDomain)) {
            
            chrome.storage.sync.get({ loginImprovements: true }, (items) => {
                
                if (!items.loginImprovements) {
                    console.log("Login improvements disabled by user.");
                    return;
                }

                chrome.scripting.executeScript({
                    target: { tabId: tabId },
                    files: [
                        "src/inject/modules/otp-handler.js",
                        "src/inject/modules/session-handler.js"
                    ],
                    world: "MAIN" 
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
                        },
                        world: "MAIN"
                    });
                    console.log("Auth modules injected.");
                })
                .catch(err => console.error("Auth injection failed:", err));
            });
        }
    }
});

// Listener per aggiornare le regole di rete quando le opzioni cambiano
chrome.storage.onChanged.addListener((changes, namespace) => {
    if (namespace === 'sync' && changes.privacyMode) {
        const ruleId = 'network_rules';
        if (changes.privacyMode.newValue) {
            // Privacy Mode ATTIVA: Disabilita regole
            chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: [ruleId] });
            console.log("Privacy Mode enabled: Ruleset disabled.");
        } else {
            // Privacy Mode DISATTIVA: Abilita regole
            chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: [ruleId] });
            console.log("Privacy Mode disabled: Ruleset enabled.");
        }
    }
});