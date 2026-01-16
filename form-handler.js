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

        // 3. Checkbox "Proposta"
        const uncheckedProposte = document.querySelectorAll('input[name="CBproposta"]:not(:checked)');
        if (uncheckedProposte.length > 0) {
            uncheckedProposte.forEach(cb => {
                cb.checked = true;
                cb.dispatchEvent(new Event('change', { bubbles: true }));
            });
        }
    }
};