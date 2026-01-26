window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.FlexibilityFixer = {
    process: function() {
        // --- 1. Trova la Card corretta ---
        let targetBody = null;
        let targetTable = null;
        let container = null;

        // Cerchiamo l'header che contiene "Flessibilità"
        const headers = Array.from(document.querySelectorAll('.panel-heading, .block-header, .panel-title'));
        const flexHeaderInfo = headers.find(h => h.textContent && h.textContent.toLowerCase().includes('flessibilità'));

        if (flexHeaderInfo) {
            container = flexHeaderInfo.closest('.panel, .block, .widget');
            if (container) {
                targetTable = container.querySelector('table');
                if (targetTable) {
                    targetBody = targetTable.querySelector('tbody');
                }
            }
        }

        if (!targetBody) return;

        // --- 2. Gestione Righe ---
        const candidates = document.querySelectorAll('tr[data-ecc-cod="FLH"]');
        let workDone = false;

        if (candidates.length > 0) {
            candidates.forEach(sourceRow => {
                if (targetTable.contains(sourceRow)) return; // Già processato

                const reqId = sourceRow.getAttribute('data-id-rich');
                if (!reqId) return;

                // --- Analisi Dettaglio Sorgente ---
                let sourceDetail = null;
                const currentTbody = sourceRow.closest('tbody');
                if (currentTbody) {
                    const nextTbody = currentTbody.nextElementSibling;
                    if (nextTbody && nextTbody.tagName === 'TBODY') {
                        const potentialDetail = nextTbody.querySelector('tr');
                        if (potentialDetail && !potentialDetail.hasAttribute('data-ecc-cod')) {
                            sourceDetail = potentialDetail;
                        }
                    }
                }

                // --- Logica Sincronizzazione ---
                const existingClone = targetBody.querySelector(`tr[data-id-rich="${reqId}"]`);
                const sourceIsVisible = sourceRow.style.display !== 'none';
                const cloneIsMissing = !existingClone;

                if (sourceIsVisible || cloneIsMissing) {
                    // Pulizia vecchio clone
                    if (existingClone) {
                        const oldDetail = existingClone.nextElementSibling;
                        if (oldDetail && !oldDetail.hasAttribute('data-ecc-cod')) oldDetail.remove();
                        existingClone.remove();
                    }

                    // Pulizia placeholder
                    const placeholder = targetBody.querySelector('td[colspan="100"]');
                    if (placeholder) placeholder.closest('tr').remove();

                    // Creazione nuovo clone
                    const newMain = sourceRow.cloneNode(true);
                    newMain.style.display = ''; 
                    targetBody.appendChild(newMain);
                    newMain.style.cursor = 'pointer';

                    let newDetail = null;
                    if (sourceDetail) {
                        newDetail = sourceDetail.cloneNode(true);
                        newDetail.style.display = 'none';
                        newDetail.style.backgroundColor = '#f9f9f9';
                        targetBody.appendChild(newDetail);
                        sourceDetail.style.display = 'none'; 
                    }

                    sourceRow.style.display = 'none'; 

                    // --- Fix Click ---
                    newMain.removeAttribute('onclick');
                    newMain.addEventListener('click', function(e) {
                        if (e.target.closest('a') || e.target.closest('.icon-trash') || (e.target.tagName === 'I' && e.target.className.includes('trash'))) return;
                        e.preventDefault();
                        e.stopPropagation();

                        if (newDetail) {
                            const arrowIcon = newMain.querySelector('.fa-angle-right, .fa-angle-down');
                            if (newDetail.style.display === 'none') {
                                newDetail.style.display = 'table-row';
                                newMain.style.backgroundColor = '#e6f7ff';
                                if (arrowIcon) {
                                    arrowIcon.classList.remove('fa-angle-right');
                                    arrowIcon.classList.add('fa-angle-down');
                                }
                            } else {
                                newDetail.style.display = 'none';
                                newMain.style.backgroundColor = '';
                                if (arrowIcon) {
                                    arrowIcon.classList.remove('fa-angle-down');
                                    arrowIcon.classList.add('fa-angle-right');
                                }
                            }
                        }
                    });

                    workDone = true;
                }
            });
        }

        // --- 3. CALCOLO STATISTICHE ---
        if (container) {
            const titleElement = container.querySelector('.panel-title, h2, .block-title');
            if (titleElement) {
                this.updateStats(targetTable, titleElement);
            }
        }

        if (workDone) {
            console.log("aBetterPlace: Flessibilità sincronizzata.");
        }
    },

    updateStats: function(table, titleElement) {
        let totalMinutesUsed = 0;
        const budgetMinutes = 600; // 10 Ore
        const timeRegex = /Dalle\s+(\d{1,2})[\.:](\d{2})\s+alle\s+(\d{1,2})[\.:](\d{2})/i;

        const rows = table.querySelectorAll('tr[data-ecc-cod="FLH"]');
        
        rows.forEach(row => {
            if (row.style.display === 'none') return;
            const text = row.innerText;
            const match = text.match(timeRegex);
            if (match) {
                const startH = parseInt(match[1], 10);
                const startM = parseInt(match[2], 10);
                const endH = parseInt(match[3], 10);
                const endM = parseInt(match[4], 10);
                const startTotal = (startH * 60) + startM;
                const endTotal = (endH * 60) + endM;
                let diff = endTotal - startTotal;
                if (diff < 0) diff = 0;
                totalMinutesUsed += diff;
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