(function() {
    // Sovrascrive la funzione di controllo bloccante
    window.CheckCeitonDaAssociarePerBloccoGiornataAsync = function() {
        return Promise.resolve(true);
    };

    // Sovrascrive il popup di navigazione
    window.ShowPopupInizialeGoDate = function(msg, fromHome, dateToGo) {
        if (typeof window.ShowPopup === 'function') {
            window.ShowPopup('', '', dateToGo, dateToGo, false, false);
        }
    };
})();