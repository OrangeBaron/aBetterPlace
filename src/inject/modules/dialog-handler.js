window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.DialogHandler = {
    process: function(options) {
        const container = document.querySelector('.swal2-container');
        const swalModal = document.querySelector('.swal2-modal.swal2-show');

        if (!container || !swalModal) {
            if (container) container.classList.remove('abp-allowed');
            return;
        }

        const toastEnabled = options ? options.toastNotifications : true;

        if (!toastEnabled) {
            container.classList.add('abp-allowed');
            return;
        }

        // --- LOGICA ORIGINALE ---
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

            if (confirmBtn) confirmBtn.click();
            container.classList.remove('abp-allowed');

        } else {
            container.classList.add('abp-allowed');
        }
    }
};