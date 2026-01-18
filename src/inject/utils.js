window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.Utils = {
    // --- 0. CSS: Iniezione stili globali ---

    injectStyles: function() {
        if (document.getElementById('abp-styles')) return;
        
        const style = document.createElement('style');
        style.id = 'abp-styles';
        style.textContent = `
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
        `;
        document.head.appendChild(style);
    },

    // --- 1. CORE: Funzioni generiche di utilità ---
    
    /**
     * Limita la frequenza di esecuzione di una funzione.
     */
    debounce: function(func, wait) {
        let timeout;
        return function(...args) {
            const context = this;
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(context, args), wait);
        };
    },

    // --- 2. DOM: Manipolazione degli elementi HTML ---
    
    DOM: {
        /**
         * Rimuove attributi disabled e classi di blocco da un elemento.
         */
        unlock: function(element) {
            if (!element) return false;
            let sbloccato = false;

            // Logica specifica per INPUT
            if (element.tagName === "INPUT" && element.hasAttribute("disabled")) {
                element.removeAttribute("disabled");
                element.classList.remove("disabled");
                Object.assign(element.style, {
                    pointerEvents: "auto",
                    cursor: "text",
                    backgroundColor: "#fff"
                });
                sbloccato = true;
            }

            // Logica specifica per LINK/BUTTONS
            if ((element.tagName === "A" || element.tagName === "BUTTON") && 
                (element.classList.contains("disable") || element.classList.contains("disabled"))) {
                element.classList.remove("disable", "disabled");
                Object.assign(element.style, {
                    pointerEvents: "auto",
                    cursor: "pointer",
                    opacity: "1"
                });
                sbloccato = true;
            }

            return sbloccato;
        },

        /**
         * Simula un cambiamento su un input per triggerare gli eventi di framework/validazione
         */
        triggerChange: function(element) {
            element.dispatchEvent(new Event('change', { bubbles: true }));
            element.dispatchEvent(new Event('input', { bubbles: true }));
        }
    },

    // --- 3. DATE: Gestione e formattazione date ---

    Date: {
        parse: function(dateString) {
            const parts = dateString.split('/');
            if (parts.length !== 3) return null;
            return new Date(parseInt(parts[2]), parseInt(parts[1]) - 1, parseInt(parts[0]));
        },

        format: function(dateObj) {
            const y = dateObj.getFullYear();
            const m = String(dateObj.getMonth() + 1).padStart(2, '0');
            const d = String(dateObj.getDate()).padStart(2, '0');
            return `${d}/${m}/${y}`;
        },

        updateInput: function(inputElement, offset) {
            if (!inputElement) return;

            const currentDate = this.parse(inputElement.value);
            if (!currentDate) return;

            currentDate.setDate(currentDate.getDate() + offset);
            const nuovaData = this.format(currentDate);

            if (inputElement.value !== nuovaData) {
                inputElement.value = nuovaData;
                window.aBetterPlace.Utils.DOM.triggerChange(inputElement);
            }
        }
    },

    // --- 4. UI: Componenti visivi ---

    UI: {
        showToast: function(title, message, titleColor = '#26affb', timeout = 1500) {
            const id = 'better-toast';
            const oldToast = document.getElementById(id);
            if (oldToast) oldToast.remove();

            const toast = document.createElement('div');
            toast.id = id;
            
            // Stili inline
            const styles = {
                position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
                backgroundColor: 'rgba(50, 50, 50, 0.95)', color: '#fff',
                padding: '12px 24px', borderRadius: '8px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: '99999',
                fontFamily: 'Segoe UI, sans-serif', fontSize: '14px',
                textAlign: 'center', minWidth: '300px', pointerEvents: 'auto',
                transition: 'opacity 0.3s ease'
            };
            Object.assign(toast.style, styles);

            const titleHtml = title ? `<div style="font-weight: bold; margin-bottom: 4px; font-size: 1.1em; color: ${titleColor};">${title}</div>` : '';
            toast.innerHTML = `${titleHtml}<div>${message}</div>`;

            document.body.appendChild(toast);

            // Auto-rimozione
            setTimeout(() => {
                toast.style.opacity = '0';
                setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
            }, timeout);
        }
    }
};