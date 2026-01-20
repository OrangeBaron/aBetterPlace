window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.StyleManager = {
    init: function() {
        if (document.getElementById('abp-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'abp-styles';
        style.textContent = `
            /* --- SweetAlert Tweaks --- */
            .swal2-container {
                visibility: hidden !important;
                opacity: 0 !important;
                transition: opacity 0.1s ease-in-out !important;
            }
            .swal2-container.abp-allowed {
                visibility: visible !important;
                opacity: 1 !important;
            }
            html:not(.swal2-shown):not(.modal-open) {
                overflow-y: auto !important;
            }

            /* --- Rendi istantaneo il pannello presenze --- */
            #modal-popin, 
            #modal-popin .modal-dialog {
                transition: none !important;
                animation: none !important;
                transition-duration: 0s !important;
                animation-duration: 0s !important;
            }
            /* Forza l'opacità a 1 immediata quando ha la classe 'in' */
            #modal-popin.in {
                opacity: 1 !important;
            }

            /* --- RIMOZIONE CHATBOT --- */
            #chatBoxContainer,
            #chatBoxButton,
            #chatCloseBoxButton,
            .chat-panel,
            .chat-msg-container,
            .chat-inner-container {
                display: none !important;
                visibility: hidden !important;
                pointer-events: none !important;
                height: 0 !important;
                width: 0 !important;
                margin: 0 !important;
                padding: 0 !important;
                opacity: 0 !important;
                z-index: -9999 !important;
            }
        `;
        document.head.appendChild(style);
    }
};