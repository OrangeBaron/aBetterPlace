window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.LayoutHandler = {
    process: function() {
        const html = document.documentElement;
        
        // Controllo rapido per evitare reflow
        if (html.style.overflowY === 'hidden' || getComputedStyle(html).overflowY === 'hidden') {
            const formInserimento = document.getElementById('form-inserimento');
            // Verifica se c'è una modale di inserimento attiva (in quel caso non toccare lo scroll)
            const isModalVisible = formInserimento && formInserimento.offsetParent !== null;

            if (!isModalVisible) {
                html.style.setProperty('overflow-y', 'auto', 'important');
                html.style.setProperty('overflow', 'visible', 'important');
                document.body.style.setProperty('overflow-y', 'auto', 'important');
            }
        }
    }
};