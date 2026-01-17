window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.LayoutHandler = {
    process: function() {
        const html = document.documentElement;
        
        // 1. Verifica se c'è una modale aperta
        const isSwalOpen = document.querySelector('.swal2-modal.swal2-show');
        const isBootstrapOpen = document.body.classList.contains('modal-open');
        
        if (isSwalOpen || isBootstrapOpen) return;

        // 2. Se non ci sono popup
        if (html.style.overflowY === 'hidden' || html.style.overflow === 'hidden') {
            
            // Rimuoviamo la proprietà che blocca
            html.style.removeProperty('overflow');
            html.style.removeProperty('overflow-y');
            
            // Rimuoviamo il padding che i framework aggiungono per compensare la scrollbar
            if (html.style.paddingRight) {
                html.style.removeProperty('padding-right');
            }

            // Forziamo lo sblocco se la rimozione non basta
            html.style.setProperty('overflow-y', 'auto', 'important');
            html.style.setProperty('overflow', 'visible', 'important');
        }
    }
};
