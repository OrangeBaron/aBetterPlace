// --- LOGICA OPZIONI ---

// Salva le opzioni su chrome.storage
const saveOptions = () => {
    const bypassRestrictions = document.getElementById('bypass-restrictions').checked;
    const privacyMode = document.getElementById('privacy-mode').checked;
    const loginImprovements = document.getElementById('login-improvements').checked;
    const toastNotifications = document.getElementById('toast-notifications').checked;
    const thePlaceMode = document.getElementById('the-place-mode').checked;
  
    chrome.storage.sync.set(
      { 
        bypassRestrictions,
        privacyMode,
        loginImprovements,
        toastNotifications,
        thePlaceMode
      },
      () => {
        const status = document.getElementById('status');
        status.style.opacity = '1';
        setTimeout(() => { status.style.opacity = '0'; }, 1500);

        updateRulesetState(privacyMode);
      }
    );
};
  
// Ripristina lo stato delle checkbox
const restoreOptions = () => {
    chrome.storage.sync.get(
      { 
        bypassRestrictions: false,
        privacyMode: false,
        loginImprovements: true,
        toastNotifications: true,
        thePlaceMode: true
      }, 
      (items) => {
        document.getElementById('bypass-restrictions').checked = items.bypassRestrictions;
        document.getElementById('privacy-mode').checked = items.privacyMode;
        document.getElementById('login-improvements').checked = items.loginImprovements;
        document.getElementById('toast-notifications').checked = items.toastNotifications;
        document.getElementById('the-place-mode').checked = items.thePlaceMode;
      }
    );
};

const updateRulesetState = (isPrivacyMode) => {
    const ruleId = 'network_rules'; 
    if (isPrivacyMode) {
        chrome.declarativeNetRequest.updateEnabledRulesets({ disableRulesetIds: [ruleId] });
    } else {
        chrome.declarativeNetRequest.updateEnabledRulesets({ enableRulesetIds: [ruleId] });
    }
};

// --- LOGICA AGGIORNAMENTI ---

const checkForUpdates = async () => {
    const repoUrl = 'https://raw.githubusercontent.com/OrangeBaron/aBetterPlace/main/manifest.json';
    
    try {
        const localVersion = chrome.runtime.getManifest().version;
        
        const response = await fetch(repoUrl);
        if (!response.ok) return;
        
        const remoteManifest = await response.json();
        const remoteVersion = remoteManifest.version;

        // Se c'è una nuova versione, mostriamo il box
        if (isNewer(remoteVersion, localVersion)) {
            const updateArea = document.getElementById('update-area');
            const versionSpan = document.getElementById('new-version');
            
            versionSpan.textContent = `v${remoteVersion}`;
            updateArea.style.display = 'block';
        }
    } catch (error) {
        console.warn('Check aggiornamenti fallito:', error);
    }
};

/**
 * Confronta versioni (Logica presa da updater.js)
 * Ritorna true se remote > local
 */
const isNewer = (remote, local) => {
    const rParts = remote.split('.').map(Number);
    const lParts = local.split('.').map(Number);
    
    for (let i = 0; i < Math.max(rParts.length, lParts.length); i++) {
        const r = rParts[i] || 0;
        const l = lParts[i] || 0;
        if (r > l) return true;
        if (r < l) return false;
    }
    return false;
};

// --- INIT ---

// Event Listeners
document.addEventListener('DOMContentLoaded', () => {
    restoreOptions();
    checkForUpdates();
});

// Aggiungi listener per tutti gli input
['bypass-restrictions', 'privacy-mode', 'login-improvements', 'toast-notifications', 'the-place-mode'].forEach(id => {
    document.getElementById(id).addEventListener('change', saveOptions);
});