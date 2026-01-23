window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.FormHandler = {
    process: function() {
        // 1. Sblocco Date
        ["data_da", "data_a"].forEach(id => {
            const input = document.getElementById(id);
            if (input && input.hasAttribute("disabled")) {
                aBetterPlace.Utils.DOM.unlock(input);
            }
        });

        // 2. Sblocco Link/Bottoni
        const disabledButtons = document.querySelectorAll("a.disable");
        if (disabledButtons.length > 0) {
            disabledButtons.forEach(btn => aBetterPlace.Utils.DOM.unlock(btn));
        }

        // 3. Checkbox Proposta
        const newProposte = document.querySelectorAll('input[name="CBproposta"]:not([data-abp-handled])');

        if (newProposte.length > 0) {
            newProposte.forEach(cb => {
                if (!cb.checked) {
                    cb.checked = true;
                    cb.dispatchEvent(new Event('change', { bubbles: true }));
                }

                cb.setAttribute('data-abp-handled', 'true');
            });
        }

        // 4. Auto-selezione Attività
        const selectsAttivita = document.querySelectorAll('select[name*="ListaAssociazioni"][name*="idattivitascelta"]:not([data-abp-handled])');

        if (selectsAttivita.length > 0) {
            selectsAttivita.forEach(select => {
                if (select.options.length >= 3) {
                    select.selectedIndex = 2; 

                    select.dispatchEvent(new Event('change', { bubbles: true }));
                }

                select.setAttribute('data-abp-handled', 'true');
            });
        }
    }
};