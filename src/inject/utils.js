window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.Utils = {
    // --- 1. CORE: Funzioni generiche di utilità ---
    
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
        unlock: function(element) {
            if (!element) return false;
            let sbloccato = false;

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
    }
};