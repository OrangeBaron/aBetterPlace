(function() {
    // 0. INIEZIONE STILI
    if (window.aBetterPlace.Utils) {
        window.aBetterPlace.Utils.injectStyles();
    }

    // Funzione principale di update
    const performUpdates = () => {
        if (document.hidden) return;

        if (window.aBetterPlace.FormHandler) window.aBetterPlace.FormHandler.process();
        if (window.aBetterPlace.DialogHandler) window.aBetterPlace.DialogHandler.process();
        if (window.aBetterPlace.LayoutHandler) window.aBetterPlace.LayoutHandler.process();
        if (window.aBetterPlace.LogoHandler) window.aBetterPlace.LogoHandler.process();
        if (window.aBetterPlace.DateNav && !document.getElementById("better-nav-btns")) {
            window.aBetterPlace.DateNav.init();
        }
    };

    // Updater
    if (window.aBetterPlace.Updater) {
        setTimeout(() => window.aBetterPlace.Updater.check(), 2000);
    }

    const safeUpdate = window.aBetterPlace.Utils.debounce(performUpdates, 200);

    // --- OBSERVER 1: BODY ---
    const bodyObserver = new MutationObserver((mutations) => {
        let shouldUpdate = false;
        for (const mutation of mutations) {
            if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                shouldUpdate = true; 
                break; 
            }
            if (mutation.type === 'attributes') { 
                shouldUpdate = true; 
                break; 
            }
        }
        if (shouldUpdate) safeUpdate();
    });

    bodyObserver.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["disabled", "class"] 
    });

    // --- OBSERVER 2: HTML ---
    const htmlObserver = new MutationObserver((mutations) => {
        if (window.aBetterPlace.LayoutHandler) window.aBetterPlace.LayoutHandler.process();
    });

    htmlObserver.observe(document.documentElement, {
        attributes: true,
        attributeFilter: ['style', 'class']
    });

    performUpdates();

})();