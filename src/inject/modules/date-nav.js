window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.DateNav = {
    init: function() {
        const inputDa = document.getElementById("data_da");
        if (!inputDa) return;

        // Evita di reinserire i bottoni se esistono già
        if (document.getElementById("better-nav-btns")) return;

        this.injectButtons(inputDa);
    },

    injectButtons: function(inputDa) {
        const colDa = inputDa.closest('.col-sm-5');
        if (!colDa) return;
        
        const colA = colDa.nextElementSibling; 
        const colBtn = colA ? colA.nextElementSibling : null;

        // Nascondi il vecchio bottone se presente
        if (colBtn) colBtn.style.display = 'none';

        // Crea container bottoni
        const btnContainer = document.createElement("div");
        btnContainer.id = "better-nav-btns";
        btnContainer.style.cssText = "display: inline-block; vertical-align: top;";
        
        btnContainer.innerHTML = `
            <button type="button" id="btn-prev-day" class="btn btn-default" style="margin-right: 5px;" title="Giorno Precedente">
                <i class="fa fa-chevron-left"></i>
            </button>
            <button type="button" id="btn-next-day" class="btn btn-default" title="Giorno Successivo">
                <i class="fa fa-chevron-right"></i>
            </button>
        `;

        // Inserimento nel DOM
        if (colA) {
            Array.from(colA.children).forEach(child => child.style.display = 'none');
            colA.appendChild(btnContainer);
            colA.style.paddingLeft = "5px"; 
        } else {
            const inputGroup = inputDa.closest('.input-group');
            if (inputGroup) {
                inputGroup.parentNode.insertBefore(btnContainer, inputGroup.nextSibling);
            }
        }

        // Listener
        document.getElementById("btn-prev-day").addEventListener("click", (e) => {
            e.preventDefault();
            aBetterPlace.Utils.Date.updateInput(document.getElementById("data_da"), -1);
        });
        
        document.getElementById("btn-next-day").addEventListener("click", (e) => {
            e.preventDefault();
            aBetterPlace.Utils.Date.updateInput(document.getElementById("data_da"), 1);
        });
    }
};