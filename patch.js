(function() {
    const applyPatch = () => {
        if (window.jQuery && !window.jQuery.globalEvalPatched) {
            
            const originalGlobalEval = window.jQuery.globalEval;
            window.jQuery.globalEval = function(code) {
                try {
                    return originalGlobalEval.apply(this, arguments);
                } catch (e) {
                    console.log("aBetterPlace: Errore intercettato e bloccato.");
                }
            };
            
            window.jQuery.globalEvalPatched = true;
            console.log("aBetterPlace: Patch applicata.");
        }
    };

    // 1. Prova immediata
    applyPatch();

    // 2. Observer per caricamento ritardato
    const observer = new MutationObserver(() => {
        if (window.jQuery) {
            applyPatch();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
    
    // 3. Fallback di sicurezza
    const interval = setInterval(() => {
        if (window.jQuery) {
            applyPatch();
            clearInterval(interval);
            observer.disconnect();
        }
    }, 500);
    
    setTimeout(() => clearInterval(interval), 10000);

})();