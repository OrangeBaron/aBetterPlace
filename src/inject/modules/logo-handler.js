window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.LogoHandler = {
    process: function() {
        // Selettore specifico per trovare l'immagine originale
        const img = document.querySelector('img[class="img-responsive standard-logo"]');

        // Se l'immagine non c'è o l'abbiamo già sostituita (controllando se il src contiene 'chrome-extension'), usciamo
        if (!img || img.src.includes('chrome-extension://')) return;

        // Recuperiamo l'URL del nuovo logo interno all'estensione
        const newLogoUrl = chrome.runtime.getURL('assets/logo.png');

        // 1. Sostituiamo la sorgente
        img.src = newLogoUrl;

        // 2. Aggiorniamo le dimensioni HTML per il layout engine
        img.setAttribute("width", "146");
        img.setAttribute("height", "40");

        // 3. Rimuoviamo eventuali stili inline che potrebbero interferire
        img.style.width = ""; 
        img.style.height = "";
    }
};
