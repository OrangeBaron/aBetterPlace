window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.DialogHandler = {
    process: function() {
        const swalModal = document.querySelector('.swal2-modal.swal2-show');
        if (!swalModal) return;

        const titleEl = swalModal.querySelector('#swal2-title');
        const contentEl = swalModal.querySelector('#swal2-content');
        const confirmBtn = swalModal.querySelector('.swal2-confirm');
        
        const titleText = titleEl ? titleEl.textContent.trim() : '';
        const titleCheck = titleText.toLowerCase();
        
        const isNota = titleCheck === 'nota';
        const isErrore = titleCheck === 'errore';

        if (isNota || isErrore) {
            const contentText = contentEl ? contentEl.textContent.trim() : '';
            const titleColor = isErrore ? '#ff4444' : '#26affb';

            if (contentText) {
                aBetterPlace.Utils.UI.showToast(titleText, contentText, titleColor);
            }

            swalModal.style.visibility = 'hidden'; 
            const container = document.querySelector('.swal2-container');
            if (container) container.style.visibility = 'hidden';
            
            if (confirmBtn) confirmBtn.click();
        } else {
            // Ripristina visibilità se necessario
            if (swalModal.style.visibility === 'hidden') {
                swalModal.style.visibility = '';
                const container = document.querySelector('.swal2-container');
                if (container) container.style.visibility = '';
            }
        }
    }
};