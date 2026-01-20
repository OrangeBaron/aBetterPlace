(function() {
    // --- CONFIGURAZIONE CENTRALIZZATA ---
    let globalOptions = {
        privacyMode: false,
        loginImprovements: true,
        toastNotifications: true,
        customLogo: true,
    };

    const performUpdates = () => {
        if (window.aBetterPlace.FormHandler) window.aBetterPlace.FormHandler.process();
        if (window.aBetterPlace.DialogHandler) window.aBetterPlace.DialogHandler.process(globalOptions);
                
        if (window.aBetterPlace.LayoutHandler) window.aBetterPlace.LayoutHandler.process();
        if (window.aBetterPlace.LogoHandler) window.aBetterPlace.LogoHandler.process(globalOptions);

        if (window.aBetterPlace.BookmarkHandler) window.aBetterPlace.BookmarkHandler.process();
        
        if (window.aBetterPlace.DateNav && !document.getElementById("better-nav-btns")) {
            window.aBetterPlace.DateNav.init();
        }
    };

    const startSystem = () => {
        // 0. INIEZIONE STILI
        if (window.aBetterPlace.StyleManager) {
            window.aBetterPlace.StyleManager.init();
        }

        if (window.aBetterPlace.Updater) {
            setTimeout(() => window.aBetterPlace.Updater.check(globalOptions), 2000);
        }

        const safeUpdate = window.aBetterPlace.Utils.debounce(performUpdates, 300);

        // --- OBSERVER 1: BODY ---
        const bodyObserver = new MutationObserver((mutations) => {
            let shouldUpdate = false;
            for (const mutation of mutations) {
                if (mutation.target.id === 'better-nav-btns' || mutation.target.id === 'better-toast') continue;
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) { shouldUpdate = true; break; }
                if (mutation.type === 'attributes') { shouldUpdate = true; break; }
            }
            if (shouldUpdate) safeUpdate();
        });

        bodyObserver.observe(document.body, {
            childList: true, subtree: true, attributes: true, attributeFilter: ["disabled", "class", "style"]
        });

        // --- OBSERVER 2: HTML ---
        const htmlObserver = new MutationObserver(() => {
            if (window.aBetterPlace.LayoutHandler) window.aBetterPlace.LayoutHandler.process();
        });

        htmlObserver.observe(document.documentElement, {
            attributes: true, attributeFilter: ['style', 'class', 'overflow', 'padding-right']
        });

        performUpdates();
    };

    // --- INIT ---
    chrome.storage.sync.get(globalOptions, (items) => {
        globalOptions = items;
        startSystem();
    });

    chrome.storage.onChanged.addListener((changes, namespace) => {
        if (namespace === 'sync') {
            let changed = false;
            for (let key in changes) {
                if (globalOptions.hasOwnProperty(key)) {
                    globalOptions[key] = changes[key].newValue;
                    changed = true;
                }
            }
            if (changed) performUpdates();
        }
    });
})();