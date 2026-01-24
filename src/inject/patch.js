(function() {
    // --- PATCH 1: JQUERY GLOBALEVAL ---
    const applyGlobalEvalPatch = () => {
        if (window.jQuery && !window.jQuery.globalEvalPatched) {
            
            const originalGlobalEval = window.jQuery.globalEval;
            window.jQuery.globalEval = function(code) {
                try {
                    return originalGlobalEval.apply(this, arguments);
                } catch (e) {
                    console.log("aBetterPlace: Errore intercettato e bloccato in jQuery.globalEval.");
                }
            };
            
            window.jQuery.globalEvalPatched = true;
            console.log("aBetterPlace: Patch jQuery applicata.");
        }
    };

    // --- PATCH 2: NATIVE ALERT TO TOAST ---
    const applyAlertPatch = () => {
        if (typeof window.abpToastEnabled !== 'undefined' && window.abpToastEnabled === false) {
            console.log("aBetterPlace: Patch Alert skippata.");
            return;
        }

        if (window.alertPatched) return;

        window.alert = function(message) {
            const msgString = (message && typeof message === 'object') ? JSON.stringify(message) : String(message);
            
            document.dispatchEvent(new CustomEvent('abp-show-toast', { 
                detail: { text: msgString } 
            }));
            
            console.log("aBetterPlace: Alert nativo convertito in toast ->", msgString);
        };

        window.alertPatched = true;
        console.log("aBetterPlace: Patch Alert applicata.");
    };

    // --- ESECUZIONE ---
    
    applyAlertPatch();

    applyGlobalEvalPatch();

    const observer = new MutationObserver(() => {
        if (window.jQuery) {
            applyGlobalEvalPatch();
        }
    });

    observer.observe(document, { childList: true, subtree: true });
    
    const interval = setInterval(() => {
        if (window.jQuery) {
            applyGlobalEvalPatch();
            clearInterval(interval);
            observer.disconnect();
        }
    }, 500);
    
    setTimeout(() => clearInterval(interval), 10000);

})();