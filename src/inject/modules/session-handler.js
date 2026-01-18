window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.SessionHandler = {
    process: function() {
        const btnContinue = document.getElementById("btnContinue");
        
        if (!btnContinue) return;

        const checkboxes = document.querySelectorAll('input[name="postfixSID"]');
        
        if (checkboxes.length > 0) {
            // 1. Copriamo tutto con il messaggio
            this.showOverlay();

            // 2. Seleziona tutte le checkbox
            checkboxes.forEach(cb => {
                cb.checked = true;
            });

            // 3. Sblocca e clicca il bottone
            btnContinue.disabled = false;
            btnContinue.classList.remove("disabled");
            
            btnContinue.click();
        }
    },

    showOverlay: function() {
        const overlay = document.createElement('div');
        overlay.id = 'abp-session-overlay';
        
        overlay.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            background-color: #ffffff;
            z-index: 9999;
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            text-align: center;
            color: #333;
        `;

        overlay.innerHTML = `
            <div style="font-size: 26px; font-weight: 600; margin-bottom: 15px; color: #26affb;">
                a Better Place
            </div>
            <div style="font-size: 18px; margin-bottom: 8px; font-weight: 500;">
                Chiusura sessioni attive in corso...
            </div>
            <div style="font-size: 15px; color: #666;">
                Accesso automatico al dispositivo in uso
            </div>
            <div style="margin-top: 30px;">
                <style>
                    @keyframes abp-spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
                    .abp-spinner {
                        border: 4px solid #f3f3f3;
                        border-top: 4px solid #26affb;
                        border-radius: 50%;
                        width: 40px;
                        height: 40px;
                        animation: abp-spin 1s linear infinite;
                        margin: 0 auto;
                    }
                </style>
                <div class="abp-spinner"></div>
            </div>
        `;

        document.body.appendChild(overlay);
    }
};