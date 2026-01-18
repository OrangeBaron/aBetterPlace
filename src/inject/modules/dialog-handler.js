window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.DialogHandler = {
    process: function() {
        // Recuperiamo il container e la modale
        const container = document.querySelector('.swal2-container');
        const swalModal = document.querySelector('.swal2-modal.swal2-show');

        // Se non c'è nessun popup attivo
        if (!container || !swalModal) {
            if (container) container.classList.remove('abp-allowed');
            return;
        }

        // Recuperiamo la preferenza utente (Default: true)
        chrome.storage.sync.get({ toastNotifications: true }, (items) => {
            
            // SE L'UTENTE HA DISATTIVATO I TOAST:
            // Mostriamo subito il popup originale e usciamo.
            if (!items.toastNotifications) {
                container.classList.add('abp-allowed');
                return;
            }

            // --- LOGICA ORIGINALE (TOAST ATTIVI) ---
            
            const titleEl = swalModal.querySelector('#swal2-title');
            const contentEl = swalModal.querySelector('#swal2-content');
            const confirmBtn = swalModal.querySelector('.swal2-confirm');
            
            const titleText = titleEl ? titleEl.textContent.trim() : '';
            const titleCheck = titleText.toLowerCase();
            
            const isNota = titleCheck === 'nota';
            const isErrore = titleCheck === 'errore';

            if (isNota || isErrore) {
                // CASO 1: POPUP DA NASCONDERE
                const contentText = contentEl ? contentEl.textContent.trim() : '';
                const titleColor = isErrore ? '#ff4444' : '#26affb';

                if (contentText) {
                    aBetterPlace.Utils.UI.showToast(titleText, contentText, titleColor);
                }

                if (confirmBtn) confirmBtn.click();
                container.classList.remove('abp-allowed');

            } else {
                // CASO 2: POPUP LEGITTIMO
                container.classList.add('abp-allowed');
            }
        });
    }
};