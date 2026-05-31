window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.FlexibilityFixer = {
    process: function() {
        // --- 1. Trova la Card corretta ---
        let targetTable = null;
        let container = null;

        // Cerchiamo l'header che contiene "Flessibilità"
        const headers = Array.from(document.querySelectorAll('.panel-heading, .block-header, .panel-title'));
        const flexHeaderInfo = headers.find(h => h.textContent && h.textContent.toLowerCase().includes('flessibilità'));

        if (flexHeaderInfo) {
            container = flexHeaderInfo.closest('.panel, .block, .widget');
            if (container) {
                targetTable = container.querySelector('table');
            }
        }

        if (!targetTable || !container) return;

        // --- 2. CALCOLO STATISTICHE ---
        const titleElement = container.querySelector('.panel-title, h2, .block-title');
        if (titleElement) {
            this.updateStats(targetTable, titleElement);
        }
    },

    updateStats: function(table, titleElement) {
        let totalMinutesUsed = 0;
        const budgetMinutes = 600; // 10 Ore
        
        // Regex per intercettare il vecchio e il nuovo formato
        const oldTimeRegex = /Dalle\s+(\d{1,2})[\.:](\d{2})\s+alle\s+(\d{1,2})[\.:](\d{2})/i;
        const newDurationRegex = /(\d+)\s*minuti/i;

        // Selezioniamo tutte le righe visibili nella tabella target
        const rows = Array.from(table.querySelectorAll('tr'));
        
        rows.forEach(row => {
            if (row.style.display === 'none') return;
            
            // Filtro di sicurezza: deve essere una richiesta di flessibilità oraria
            const text = row.innerText;
            if (!text.toLowerCase().includes('flessibilita')) return;

            // Tentativo 1: Vecchio formato (es. "Dalle 09:00 alle 11:00")
            const timeMatch = text.match(oldTimeRegex);
            if (timeMatch) {
                const startH = parseInt(timeMatch[1], 10);
                const startM = parseInt(timeMatch[2], 10);
                const endH = parseInt(timeMatch[3], 10);
                const endM = parseInt(timeMatch[4], 10);
                const startTotal = (startH * 60) + startM;
                const endTotal = (endH * 60) + endM;
                let diff = endTotal - startTotal;
                if (diff < 0) diff = 0;
                totalMinutesUsed += diff;
            } 
            // Tentativo 2: Nuovo formato (es. "120 minuti")
            else {
                const durationMatch = text.match(newDurationRegex);
                if (durationMatch) {
                    totalMinutesUsed += parseInt(durationMatch[1], 10);
                }
            }
        });

        const remainingMinutes = budgetMinutes - totalMinutesUsed;

        const formatTime = (totalMin) => {
            const h = Math.floor(Math.abs(totalMin) / 60);
            const m = Math.abs(totalMin) % 60;
            return `${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}`;
        };

        const usedStr = formatTime(totalMinutesUsed);
        const remainStr = formatTime(remainingMinutes);

        // --- Costruzione Nuovo Titolo ---
        let baseText = titleElement.innerText;
        if (baseText.includes('(')) {
            baseText = baseText.split('(')[0].trim();
        }
        
        const newTitle = `${baseText} (usata: ${usedStr}, rimanente: ${remainStr})`;

        // --- ANTI-LOOP CHECK ---
        if (titleElement.innerText === newTitle) {
            return;
        }

        // Applicazione
        titleElement.innerText = newTitle;
    }
};