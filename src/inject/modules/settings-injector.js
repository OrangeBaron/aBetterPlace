window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.SettingsInjector = {
    init: function() {
        // Verifica di essere nella pagina Impostazioni
        if (!location.href.includes('Impostazioni') && !document.title.includes('Impostazioni')) return;

        // Evita di iniettare due volte
        if (document.getElementById('abp-settings-panel')) return;

        this.injectPanel();
        
        // Avvia il controllo aggiornamenti
        this.checkUpdates();
    },

    injectPanel: function() {
        // Cerchiamo la colonna principale e il pannello notifiche per accodarci
        const targetCol = document.querySelector('.col-md-8');
        const notifichePanel = document.getElementById('NOTIFICHE');
        
        if (!targetCol) return;

        // Creazione del contenitore Panel
        const panel = document.createElement('section');
        panel.id = 'abp-settings-panel';
        panel.className = atob('cmFpIHBhbmVs');
        
        // HTML interno che imita lo stile nativo del portale
        const manifest = chrome.runtime.getManifest();
        
        panel.innerHTML = `
            <header class="panel-heading">
                <h1 class="panel-title">
                    Estensione: a Better Place 
                    <span style="font-weight:normal; opacity:0.6; font-size: 0.8em; margin-left:10px;">v${manifest.version}</span>
                </h1>
            </header>
            <div class="panel-body">
                <div class="block block-content-table">
                    
                    <div class="block-header block-content-mini">
                        <label class="${atob('cmFpLWZvbnQtdGFibGUtaGVhZGluZw')}">Preferenze</label>
                    </div>
                    
                    <div class="block-content">
                        ${this.renderOption('bypassRestrictions', 'Sblocco Totale', 'Abilita l\'inserimento delle richieste ignorando i controlli di assenza ingiustificata e associazione delle attività.', '#d32f2f')}
                        ${this.renderOption('privacyMode', 'Modalità Privacy (network aziendale)', 'Disabilita il caricamento di font e librerie da server esterni (CDN). Attiva questa opzione se sei su una rete chiusa o vuoi evitare connessioni verso internet.')}
                        ${this.renderOption('loginImprovements', 'Migliorie Login', 'Migliora la gestione dell\'autenticazione (inserimento credenziali, chiusura sessioni). Disattiva se riscontri problemi di accesso.')}
                        ${this.renderOption('toastNotifications', 'Usa notifiche non invasive (toast)', 'Sostituisce i popup bloccanti con notifiche a scomparsa in basso, evitando di dover cliccare "OK" ogni volta.')}
                        ${this.renderOption('thePlaceMode', 'Interfaccia mobile in stile "The Place"', 'Sostituisce l\'intestazione e i menu originali con quelli dell\'app "The Place" per la navigazione da smartphone.')}
                    </div>

                    <div style="padding: 15px; border-top: 1px solid #c2cfd6; margin-top: 15px; display: flex; justify-content: space-between; align-items: center;">
                        
                        <div id="abp-update-container" style="display:none; font-size: 13px;">
                            </div>

                        <a href="https://github.com/OrangeBaron/aBetterPlace" target="_blank" style="color:#0a3247; text-decoration:none; font-size:13px; display: flex; align-items: center; margin-left: auto;">
                            <i class="fa fa-github" aria-hidden="true" style="margin-right: 5px;"></i> Repository GitHub
                        </a>
                    </div>
                </div>
            </div>
        `;

        // Inseriamo il pannello subito dopo quello delle notifiche
        if (notifichePanel && notifichePanel.parentNode === targetCol) {
            targetCol.insertBefore(panel, notifichePanel.nextSibling);
            panel.style.marginTop = "20px";
        } else {
            targetCol.appendChild(panel);
        }

        // Attiva i listener sugli input
        this.bindOptions();
    },

    renderOption: function(key, label, desc, color = null) {
        const styleColor = color ? `style="color:${color}"` : '';
        return `
            <div class="row push-10-t" style="margin-bottom: 20px;">
                <div class="col-sm-12">
                    <div class="${atob('cmFpLWNoZWNrYm94')}"> <input type="checkbox" id="abp-${key}" data-key="${key}">
                        <label for="abp-${key}" ${styleColor}>
                            <b>${label}</b>
                        </label>
                    </div>
                    <div style="font-size: 13px; color: #777; margin: 4px 0 0 25px;">${desc}</div>
                </div>
            </div>
        `;
    },

    bindOptions: function() {
        const defaults = { 
            bypassRestrictions: false, 
            privacyMode: false, 
            loginImprovements: true, 
            toastNotifications: true, 
            thePlaceMode: true 
        };

        chrome.storage.sync.get(defaults, (items) => {
            Object.keys(defaults).forEach(key => {
                const checkbox = document.getElementById(`abp-${key}`);
                if (checkbox) {
                    checkbox.checked = items[key];

                    checkbox.addEventListener('change', (e) => {
                        const val = e.target.checked;
                        chrome.storage.sync.set({ [key]: val }, () => {
                            if (window.aBetterPlace.UIManager) {
                                window.aBetterPlace.UIManager.showToast('Impostazione salvata', '', '#4caf50', 2000);
                            }
                            // Se cambia la privacy mode, ricontrolla gli aggiornamenti
                            if (key === 'privacyMode') {
                                if (val) {
                                    // Se attivata privacy, nascondi avviso
                                    const container = document.getElementById('abp-update-container');
                                    if(container) container.style.display = 'none';
                                } else {
                                    // Se disattivata privacy, controlla
                                    this.checkUpdates();
                                }
                            }
                        });
                    });
                }
            });
        });
    },

    checkUpdates: function() {
        // 1. Leggi impostazione privacy
        chrome.storage.sync.get({ privacyMode: false }, async (items) => {
            if (items.privacyMode) return;

            const repoUrl = 'https://raw.githubusercontent.com/OrangeBaron/aBetterPlace/main/manifest.json';
            
            try {
                const localVersion = chrome.runtime.getManifest().version;
                
                const response = await fetch(repoUrl);
                if (!response.ok) return;
                
                const remoteManifest = await response.json();
                const remoteVersion = remoteManifest.version;

                // Usa la logica di confronto versioni di Updater se disponibile, altrimenti fallback locale
                let isNewer = false;
                if (window.aBetterPlace.Updater && typeof window.aBetterPlace.Updater.isNewer === 'function') {
                    isNewer = window.aBetterPlace.Updater.isNewer(remoteVersion, localVersion);
                } else {
                    // Fallback semplice
                    isNewer = remoteVersion !== localVersion; 
                }

                if (isNewer) {
                    this.showUpdateUI(remoteVersion);
                }

            } catch (error) {
                console.warn('aBetterPlace: Check aggiornamenti fallito', error);
            }
        });
    },

    showUpdateUI: function(version) {
        const container = document.getElementById('abp-update-container');
        if (!container) return;

        container.style.display = 'block';
        container.innerHTML = `
            <div style="color: #28a745; font-weight: bold; margin-bottom: 2px;">
                <i class="fa fa-arrow-circle-o-up"></i> Nuova versione disponibile: v${version}
            </div>
            <a href="https://github.com/OrangeBaron/aBetterPlace/archive/refs/heads/main.zip" 
               target="_blank" 
               style="color: #0a3247; text-decoration: underline; font-weight: normal;">
               Scarica aggiornamento
            </a>
        `;
    }
};