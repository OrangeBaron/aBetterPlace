// Salva le opzioni su chrome.storage
const saveOptions = () => {
    const privacyMode = document.getElementById('privacy-mode').checked;
  
    chrome.storage.sync.set(
      { privacyMode: privacyMode },
      () => {
        // Aggiorna visivamente lo stato di salvataggio
        const status = document.getElementById('status');
        status.style.opacity = '1';
        setTimeout(() => { status.style.opacity = '0'; }, 1500);

        // Applica immediatamente la logica dei ruleset
        updateRulesetState(privacyMode);
      }
    );
  };
  
  // Ripristina lo stato della checkbox usando le preferenze salvate
  const restoreOptions = () => {
    chrome.storage.sync.get(
      { privacyMode: false }, // Default: Privacy Mode spenta (CDN attive)
      (items) => {
        document.getElementById('privacy-mode').checked = items.privacyMode;
      }
    );
  };

  // Funzione Core: Abilita/Disabilita le regole di rete
  const updateRulesetState = (isPrivacyMode) => {
      // L'ID 'network_rules' deve corrispondere a quello nel manifest.json
      const ruleId = 'network_rules'; 
      
      if (isPrivacyMode) {
          // Se Privacy Mode è ON -> DISABILITA le regole (niente redirect verso CDN)
          chrome.declarativeNetRequest.updateEnabledRulesets({
              disableRulesetIds: [ruleId]
          });
          console.log('aBetterPlace: Privacy Mode ON. Regole esterne disabilitate.');
      } else {
          // Se Privacy Mode è OFF -> ABILITA le regole (usa CDN veloci)
          chrome.declarativeNetRequest.updateEnabledRulesets({
              enableRulesetIds: [ruleId]
          });
          console.log('aBetterPlace: Privacy Mode OFF. Regole esterne abilitate.');
      }
  };
  
  document.addEventListener('DOMContentLoaded', restoreOptions);
  document.getElementById('privacy-mode').addEventListener('change', saveOptions);