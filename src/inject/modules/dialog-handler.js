window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.DialogHandler = {
    process: function(options) {
        const container = document.querySelector('.swal2-container');
        const swalModal = document.querySelector('.swal2-modal.swal2-show');

        // Se non c'è modale attiva
        if (!container || !swalModal) {
            if (container) container.classList.remove('abp-allowed');
            return;
        }

        const toastEnabled = options ? options.toastNotifications : true;

        // Se l'utente ha disabilitato i toast nelle opzioni
        if (!toastEnabled) {
            container.classList.add('abp-allowed');
            return;
        }

        // --- CONTROLLO 1: Ci sono campi di input visibili? ---
        // Se c'è una textarea o un input visibile, è un form interattivo: NON toccare.
        const interactives = Array.from(swalModal.querySelectorAll('textarea, input, select'));
        const hasVisibleInput = interactives.some(el => {
            return el.offsetParent !== null && // check visibilità standard
                   el.type !== 'hidden' &&
                   window.getComputedStyle(el).display !== 'none';
        });

        if (hasVisibleInput) {
            container.classList.add('abp-allowed');
            return;
        }

        // --- CONTROLLO 2: Analisi bottoni ---
        // Selezioniamo TUTTI i button, esclusa la "X" di chiusura in alto a destra
        const allButtons = Array.from(swalModal.querySelectorAll('button:not(.swal2-close)'));
        
        const visibleButtons = allButtons.filter(btn => {
            return btn.offsetWidth > 0 && 
                   btn.offsetHeight > 0 && 
                   window.getComputedStyle(btn).display !== 'none';
        });

        // Controllo testo "Invia" / "Salva" / "Conferma"
        let isImportantAction = false;
        if (visibleButtons.length === 1) {
            const btnText = (visibleButtons[0].textContent || "").toLowerCase();
            if (btnText.includes("invia") || btnText.includes("salva") || btnText.includes("conferma")) {
                isImportantAction = true;
            }
        }

        // Logica decisionale:
        // Se c'è 0 o 1 bottone (e non è un'azione importante), converti in toast.
        // Altrimenti (2+ bottoni O bottone "Invia"), mostra il popup.
        if (visibleButtons.length <= 1 && !isImportantAction) {
            
            const titleEl = swalModal.querySelector('#swal2-title');
            const contentEl = swalModal.querySelector('#swal2-content');
            
            // Estrazione pulita del testo
            const rawTitle = titleEl ? titleEl.innerText.trim() : '';
            // Rimuoviamo eventuali tag script o style dal contenuto per sicurezza
            let rawContent = '';
            if (contentEl) {
                const clone = contentEl.cloneNode(true);
                // Rimuoviamo il bottone custom dal contenuto clonato per non leggere il testo "Invia" nel messaggio del toast
                const internalBtns = clone.querySelectorAll('button');
                internalBtns.forEach(b => b.remove());
                rawContent = clone.innerText.trim();
            }

            let toastTitle = rawTitle;
            let toastMessage = rawContent;

            // Se il titolo e il contenuto sono identici (capita spesso), mostriamo solo uno
            if (toastTitle === toastMessage) {
                toastMessage = "";
            } else if (rawTitle && !rawContent) {
                toastTitle = "";
                toastMessage = rawTitle;
            }

            // Determina colore (Errore vs Info)
            const isError = (toastTitle + toastMessage).toLowerCase().includes('errore');
            const titleColor = isError ? '#ff4444' : '#26affb';

            // Mostriamo il Toast
            if ((toastTitle || toastMessage) && window.aBetterPlace.UIManager) {
                window.aBetterPlace.UIManager.showToast(toastMessage, toastTitle, titleColor);
            }

            // Clicchiamo l'unico bottone rimasto (es. "OK") se esiste, per chiudere la logica del portale
            if (visibleButtons.length === 1) {
                visibleButtons[0].click();
            } else {
                // Fallback: prova a cliccare il confirm standard anche se nascosto
                const confirmBtn = swalModal.querySelector('.swal2-confirm');
                if (confirmBtn) confirmBtn.click();
            }
            
            // Nascondiamo il container visivamente
            container.classList.remove('abp-allowed');

        } else {
            // Caso Popup Importante: Mostra tutto
            container.classList.add('abp-allowed');
        }
    }
};