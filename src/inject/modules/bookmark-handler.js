window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.BookmarkHandler = {
    networkStatus: 'unknown',
    isChecking: false,

    process: function() {
        // 1. Se abbiamo già stabilito che siamo "interni", non serve fare nulla.
        if (this.networkStatus === 'internal') return;

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
                break;
            }
        }

        if (!testAnchor) return;

        // 5. Eseguiamo il test di raggiungibilità
        this.isChecking = true;
        
        fetch(testAnchor.href, { method: 'HEAD' })
            .then(response => {
                if (response.ok) {
                    this.networkStatus = 'internal';
                } else {
                    throw new Error("Link rotto o 404");
                }
            })
            .catch(() => {
                this.networkStatus = 'external';
                
                this.applyFix(document.querySelectorAll('#menu-principale a, #menu a'), linkMap);
            })
            .finally(() => {
                this.isChecking = false;
            });
    },

    applyFix: function(anchors, linkMap) {
        const baseUrl = `${window.location.protocol}//${window.location.hostname}:11003`;

        anchors.forEach(anchor => {
            const text = anchor.textContent.trim().toUpperCase();
            
            if (linkMap.hasOwnProperty(text)) {
                const correctUrl = baseUrl + linkMap[text];
                
                if (anchor.href !== correctUrl) {
                    anchor.href = correctUrl;
                }
            }
        });
    }
};