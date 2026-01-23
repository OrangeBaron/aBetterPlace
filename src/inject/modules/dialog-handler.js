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

        // --- Analisi bottoni visibili ---
        const allButtons = Array.from(swalModal.querySelectorAll('button.swal2-styled'));
        
        const visibleButtons = allButtons.filter(btn => {
            return btn.offsetWidth > 0 && 
                   btn.offsetHeight > 0 && 
                   window.getComputedStyle(btn).display !== 'none';
        });

        // 0 o 1 bottone visibile
        if (visibleButtons.length <= 1) {
            
            const titleEl = swalModal.querySelector('#swal2-title');
            const contentEl = swalModal.querySelector('#swal2-content');
            
            const rawTitle = titleEl ? titleEl.textContent.trim() : '';
            const rawContent = contentEl ? contentEl.textContent.trim() : '';

            // Se c'è il titolo ma non il contenuto
            let toastTitle = rawTitle;
            let toastMessage = rawContent;

            if (rawTitle && !rawContent) {
                toastTitle = "";
                toastMessage = rawTitle;
            }

            // Determina colore
            const isError = toastTitle.toLowerCase().includes('errore');
            const titleColor = isError ? '#ff4444' : '#26affb';

            // Mostriamo il Toast
            if ((toastTitle || toastMessage) && window.aBetterPlace.UIManager) {
                window.aBetterPlace.UIManager.showToast(toastTitle, toastMessage, titleColor);
            }

            // Clicchiamo il bottone di conferma
            const confirmBtn = swalModal.querySelector('.swal2-confirm');
            if (confirmBtn) {
                confirmBtn.click();
            }
            
            // Nascondiamo il container visivamente
            container.classList.remove('abp-allowed');

        } else {
            // 2 o più bottoni
            container.classList.add('abp-allowed');
        }
    }
};