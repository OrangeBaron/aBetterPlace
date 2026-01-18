window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.BookmarkHandler = {
    process: function() {
        const linkMap = {
            "COMUNICAZIONE": "/pagine/comunicazione/",
            "CORPORATE": "/pagine/corporate/",
            "NORME E PROCEDURE": "/pagine/norme-e-procedure/",
            "WELFARE E BENEFIT": "/pagine/welfare-e-benefit/",
            [atob("UkFJIEFDQURFTVk=")]: atob("L3BhZ2luZS9yYWktYWNhZGVteS0yMDIwLw==")
        };

        // Costruiamo l'URL base usando il dominio corrente forzando la porta 11003
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:11003`;

        // Selezioniamo i link
        const anchors = document.querySelectorAll('#menu-principale a, #menu a');

        anchors.forEach(anchor => {
            const text = anchor.textContent.trim().toUpperCase();
            
            // Se il testo corrisponde a uno di quelli da correggere
            if (linkMap.hasOwnProperty(text)) {
                const correctUrl = baseUrl + linkMap[text];
                
                // Aggiorniamo l'href se non è già corretto
                if (anchor.href !== correctUrl) {
                    anchor.href = correctUrl;
                }
            }
        });
    }
};