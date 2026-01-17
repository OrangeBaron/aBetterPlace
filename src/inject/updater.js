window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.Updater = {
    // Configurazione
    repoUrl: 'https://raw.githubusercontent.com/OrangeBaron/aBetterPlace/main/manifest.json',
    
    check: async function() {
        try {
            // 1. Recupera la versione locale
            const localManifest = chrome.runtime.getManifest();
            const localVersion = localManifest.version;

            // 2. Recupera la versione remota
            const response = await fetch(this.repoUrl);
            if (!response.ok) return;
            
            const remoteManifest = await response.json();
            const remoteVersion = remoteManifest.version;

            // 3. Confronta
            if (this.isNewer(remoteVersion, localVersion)) {
                this.notifyUpdate(remoteVersion);
            } else {
                console.log(`aBetterPlace è aggiornato (v${localVersion})`);
            }

        } catch (error) {
            console.warn('Impossibile verificare aggiornamenti:', error);
        }
    },

    /**
     * Confronta due stringhe di versione
     * Ritorna true se remote > local
     */
    isNewer: function(remote, local) {
        const rParts = remote.split('.').map(Number);
        const lParts = local.split('.').map(Number);
        
        for (let i = 0; i < Math.max(rParts.length, lParts.length); i++) {
            const r = rParts[i] || 0;
            const l = lParts[i] || 0;
            if (r > l) return true;
            if (r < l) return false;
        }
        return false;
    },

    notifyUpdate: function(newVersion) {
        const msg = `È disponibile la versione <b>${newVersion}</b>.<br>
                     <a href="https://github.com/OrangeBaron/aBetterPlace/archive/refs/heads/main.zip" target="_blank" style="color: #fff; text-decoration: underline;">Clicca qui per scaricarla</a>.`;
        
        if (window.aBetterPlace.Utils && window.aBetterPlace.Utils.UI) {
            window.aBetterPlace.Utils.UI.showToast("Aggiornamento", msg, "#28a745", 3000);
        }
    }
};
