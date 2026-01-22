window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.LayoutHandler = {
    process: function() {
        const html = document.documentElement;
        const body = document.body;
        
        // --- 1. RILEVAMENTO ZOMBIE MODAL ---
        
        const sidePanel = document.getElementById('modal-popin');
        
        const isBodyLocked = body.classList.contains('modal-open');
        
        const isSidePanelActive = sidePanel && sidePanel.classList.contains('in');

        if (isBodyLocked && !isSidePanelActive) {
            
            const otherModals = document.querySelectorAll('.modal.in'); 
            const swalOpen = document.querySelector('.swal2-modal.swal2-show');

            if (otherModals.length === 0 && !swalOpen) {
                
                // A. Rimuovi blocco dal body
                body.classList.remove('modal-open');
                body.style.removeProperty('overflow');
                body.style.removeProperty('padding-right');

                // B. Distruggi il backdrop scuro residuo
                const backdrops = document.querySelectorAll('.modal-backdrop');
                backdrops.forEach(bd => bd.remove());

                // C. Nascondi forzatamente il pannello
                if (sidePanel) {
                    sidePanel.style.display = 'none';
                }
            }
        }

        // --- 2. GESTIONE SCROLL HTML ---
        
        const isSwalOpenNow = document.querySelector('.swal2-modal.swal2-show');
        const isBootstrapOpenNow = body.classList.contains('modal-open');
        
        if (isSwalOpenNow || isBootstrapOpenNow) return;

        // Se non ci sono popup attivi, forziamo lo sblocco di HTML
        if (html.style.overflowY === 'hidden' || html.style.overflow === 'hidden') {
            
            html.style.removeProperty('overflow');
            html.style.removeProperty('overflow-y');
            
            if (html.style.paddingRight) {
                html.style.removeProperty('padding-right');
            }

            // Forzatura finale
            html.style.setProperty('overflow-y', 'auto', 'important');
            html.style.setProperty('overflow', 'visible', 'important');
        }
    }
};