window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.DialogHandler = {
    process: function() {
        // Recuperiamo il container e la modale
        const container = document.querySelector('.swal2-container');
        const swalModal = document.querySelector('.swal2-modal.swal2-show');

        // Se non c'è nessun popup attivo
        if (!container || !swalModal) {
            // PULIZIA: Rimuoviamo la classe 'abp-allowed' se presente, 
            // così il prossimo popup che si aprirà partirà di nuovo invisibile.
            if (container) container.classList.remove('abp-allowed');
            return;
        }

        const titleEl = swalModal.querySelector('#swal2-title');
        const contentEl = swalModal.querySelector('#swal2-content');
        const confirmBtn = swalModal.querySelector('.swal2-confirm');
        
        const titleText = titleEl ? titleEl.textContent.trim() : '';
        const titleCheck = titleText.toLowerCase();
        
        const isNota = titleCheck === 'nota';
        const isErrore = titleCheck === 'errore';

        if (isNota || isErrore) {
            // --- CASO 1: POPUP DA NASCONDERE ---
            // NON aggiungiamo la classe 'abp-allowed'.
            // Il popup esiste nel DOM ma è invisibile grazie al CSS in utils.js.

            const contentText = contentEl ? contentEl.textContent.trim() : '';
            const titleColor = isErrore ? '#ff4444' : '#26affb';

            // Mostriamo il Toast sostitutivo
            if (contentText) {
                aBetterPlace.Utils.UI.showToast(titleText, contentText, titleColor);
            }

            // Clicchiamo "OK" sul bottone invisibile per sbloccare la pagina
            if (confirmBtn) confirmBtn.click();
            
            // Sicurezza extra: ci assicuriamo che rimanga invisibile mentre si chiude
            container.classList.remove('abp-allowed');

        } else {
            // --- CASO 2: POPUP LEGITTIMO ---
            // È un messaggio che l'utente DEVE vedere.
            // Aggiungiamo la classe che sovrascrive il CSS e lo rende visibile.
            container.classList.add('abp-allowed');
        }
    }
};