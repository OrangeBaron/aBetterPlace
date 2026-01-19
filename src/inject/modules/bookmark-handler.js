window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.BookmarkHandler = {
    // Stati possibili: 'unknown' (non ancora verificato), 'internal' (rete aziendale), 'external' (fuori ufficio)
    networkStatus: 'unknown',
    isChecking: false,

    process: function() {
        // 1. Se abbiamo già stabilito che siamo "interni", non serve fare nulla.
        if (this.networkStatus === 'internal') return;

        // Mappa dei link da controllare/correggere
        const linkMap = {
            "COMUNICAZIONE": "/pagine/comunicazione/",
            "CORPORATE": "/pagine/corporate/",
            "NORME E PROCEDURE": "/pagine/norme-e-procedure/",
            "WELFARE E BENEFIT": "/pagine/welfare-e-benefit/",
            [atob("UkFJIEFDQURFTVk=")]: atob("L3BhZ2luZS9yYWktYWNhZGVteS0yMDIwLw==")
        };

        const anchors = document.querySelectorAll('#menu-principale a, #menu a');

        // 2. Se abbiamo già stabilito che siamo "esterni", applichiamo subito la correzione
        if (this.networkStatus === 'external') {
            this.applyFix(anchors, linkMap);
            return;
        }

        // 3. Se stiamo già eseguendo il test di connessione, aspettiamo
        if (this.isChecking) return;

        // 4. Cerchiamo un "link cavia" presente nella pagina corrente
        let testAnchor = null;
        for (const anchor of anchors) {
            if (linkMap.hasOwnProperty(anchor.textContent.trim().toUpperCase())) {
                testAnchor = anchor;
                break; // Ne basta uno qualsiasi
            }
        }

        // Se non ci sono link da correggere nella pagina, usciamo
        if (!testAnchor) return;

        // 5. Eseguiamo il test di raggiungibilità
        this.isChecking = true;
        
        fetch(testAnchor.href, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    // Il link funziona: siamo nella rete interna
                    this.networkStatus = 'internal';
                } else {
                    // Il server ha risposto con errore
                    throw new Error("Link rotto o 404");
                }
            })
            .catch(() => {
                // Fetch fallita o errore rilevato
                this.networkStatus = 'external';
                
                // Richiamiamo la funzione di fix sugli elementi
                this.applyFix(document.querySelectorAll('#menu-principale a, #menu a'), linkMap);
            })
            .finally(() => {
                this.isChecking = false;
            });
    },

    applyFix: function(anchors, linkMap) {
        // Costruiamo l'URL modificato con la porta 11003
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:11003`;

        anchors.forEach(anchor => {
            const text = anchor.textContent.trim().toUpperCase();
            
            if (linkMap.hasOwnProperty(text)) {
                const correctUrl = baseUrl + linkMap[text];
                
                // Aggiorniamo l'href solo se diverso
                if (anchor.href !== correctUrl) {
                    anchor.href = correctUrl;
                }
            }
        });
    }
};