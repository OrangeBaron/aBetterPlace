window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.BookmarkHandler = {
    networkStatus: 'unknown',
    isChecking: false,

    process: function() {
        // 1. Se siamo interni, non serve fare nulla
        if (this.networkStatus === 'internal') return;

        const anchors = document.querySelectorAll('#headerRight a, #menu a');

        // 2. Se siamo già stati rilevati come esterni, applichiamo la correzione
        if (this.networkStatus === 'external') {
            this.applyFix(anchors);
            return;
        }

        // 3. Evita controlli multipli simultanei
        if (this.isChecking) return;

        // 4. Cerchiamo un qualsiasi link
        let testAnchor = null;
        for (const anchor of anchors) {
            if (anchor.href.includes('/pagine/')) {
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
                    throw new Error("Link irraggiungibile, assumiamo esterno");
                }
            })
            .catch(() => {
                // Se fallisce, assumiamo di essere esterni e applichiamo il fix
                this.networkStatus = 'external';
                this.applyFix(anchors);
            })
            .finally(() => {
                this.isChecking = false;
            });
    },

    applyFix: function(anchors) {
        anchors.forEach(anchor => {
            // Applica la logica solo ai link che contengono "/pagine/"
            if (anchor.href.includes('/pagine/')) {
                try {
                    const url = new URL(anchor.href);
                    
                    // Aggiunge la porta 11003 se non è già presente
                    if (url.port !== '11003') {
                        url.port = '11003';
                        anchor.href = url.toString();
                    }
                } catch (e) {
                    console.warn("URL non valido trovato nel menu", anchor.href);
                }
            }
        });
    }
};