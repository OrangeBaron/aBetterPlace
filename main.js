// Entry point principale

(function() {
    // Funzione che esegue le logiche
    const performUpdates = () => {
        
        // 1. Eseguiamo i moduli
        if (window.aBetterPlace.FormHandler) window.aBetterPlace.FormHandler.process();
        if (window.aBetterPlace.DialogHandler) window.aBetterPlace.DialogHandler.process();
        if (window.aBetterPlace.LayoutHandler) window.aBetterPlace.LayoutHandler.process();

        // 2. Gestione interfaccia Date
        if (window.aBetterPlace.DateNav) {
            window.aBetterPlace.DateNav.init();
        }
    };

    // --- Controllo Aggiornamenti ---
    if (window.aBetterPlace.Updater) {
        window.aBetterPlace.Updater.check();
    }

    // Creiamo la versione debounced: aspetta 150ms
    const safeUpdate = window.aBetterPlace.Utils.debounce(performUpdates, 150);

    const observer = new MutationObserver((mutations) => {
        safeUpdate();
    });

    // Avvia l'osservatore
    observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ["disabled", "class", "style", "value"] 
    });

})();