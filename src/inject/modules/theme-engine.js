window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.ThemeEngine = {
    process: function(options) {
        if (!options.themeEngine) return;

        if (location.href.includes('Impostazioni') || document.title.includes('Impostazioni')) {
            chrome.storage.sync.get({ customTheme: 'blue' }, (items) => {
                this.fixSettingsUI(items.customTheme);
            });
        }
    },

    fixSettingsUI: function(savedTheme) {
        const radioInputs = document.querySelectorAll('input[type="radio"][onclick*="changecss"]:not([data-abp-theme-handled])');
        
        if (radioInputs.length === 0) return;

        radioInputs.forEach(radio => {
            const match = radio.getAttribute('onclick').match(/changecss\('([^']+)'\)/);
            if (!match) return;
            
            const radioColor = match[1];

            radio.removeAttribute('onclick');
            radio.setAttribute('data-abp-theme-handled', 'true');

            radio.checked = (radioColor === savedTheme);

            radio.addEventListener('change', (e) => {
                if (e.target.checked) {
                    this.saveAndApplyTheme(radioColor);
                }
            });
        });
    },

    saveAndApplyTheme: function(color) {
        chrome.runtime.sendMessage({ action: "updateTheme", theme: color }, (response) => {
            
            if (response && response.status === "success") {
                
                const links = document.querySelectorAll('link[rel="stylesheet"]');
                links.forEach(link => {
                    if (link.href && link.href.includes('/skins/')) {
                        try {
                            const url = new URL(link.href);
                            url.searchParams.set('abp_theme_refresh', Date.now());
                            link.href = url.toString();
                        } catch(e) {}
                    }
                });

                if (window.aBetterPlace.UIManager) {
                    window.aBetterPlace.UIManager.showToast(`Tema aggiornato: ${color}`, "Theme Engine", "#26affb", 2000);
                }
            } else {
                console.error("aBetterPlace Theme Engine: Il background ha fallito l'aggiornamento di rete.");
            }
        });
    }
};