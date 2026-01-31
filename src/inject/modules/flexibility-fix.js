window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.FlexibilityFixer = {
    process: function() {
        // --- 1. Trova la Card corretta (Destinazione) ---
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

        // --- 2. Raccolta Candidati (Sorgenti) ---
        // A. Criterio standard: attributo FLH (funziona per gli "Esiti")
        const standardCandidates = Array.from(document.querySelectorAll('tr[data-ecc-cod="FLH"]'));
        
        // B. Criterio testo: cerca nella tabella "Le mie richieste" (In attesa)
        //    Nota: queste righe non hanno il codice FLH, quindi le cerchiamo per contenuto testo.
        const pendingTable = document.getElementById('lemierichieste');
        let pendingCandidates = [];
        
        if (pendingTable) {
            const allPendingRows = Array.from(pendingTable.querySelectorAll('tr'));
            pendingCandidates = allPendingRows.filter(row => {
                const text = row.innerText || "";
                // Escludiamo se ha già il codice (preso sopra) o se non contiene la parola chiave
                return !row.hasAttribute('data-ecc-cod') && text.toUpperCase().includes('FLESSIBILITA ORARIA');
            });
        }

        // Uniamo le due liste
        const allCandidates = [...standardCandidates, ...pendingCandidates];
        let workDone = false;

        if (allCandidates.length > 0) {
            allCandidates.forEach(sourceRow => {
                // Evita di processare se la riga è già nella tabella di destinazione
                if (targetTable.contains(sourceRow)) return; 

                // Recupero ID univoco: le richieste in attesa usano 'data-richparent', le altre 'data-id-rich'
                const reqId = sourceRow.getAttribute('data-id-rich') || sourceRow.getAttribute('data-richparent');
                
                if (!reqId) return;

                // --- Analisi Dettaglio Sorgente ---
                // Cerchiamo se c'è una riga di dettaglio subito sotto (spesso nascosta)
                let sourceDetail = null;
                const currentTbody = sourceRow.closest('tbody');
                if (currentTbody) {
                    // A volte il dettaglio è in un tbody successivo (struttura standard portale)
                    const nextTbody = currentTbody.nextElementSibling;
                    if (nextTbody && nextTbody.tagName === 'TBODY') {
                        const potentialDetail = nextTbody.querySelector('tr');
                        if (potentialDetail && !potentialDetail.hasAttribute('data-ecc-cod')) {
                            sourceDetail = potentialDetail;
                        }
                    } else {
                        // Nelle tabelle "pending" a volte il dettaglio è la riga successiva nello stesso tbody?
                        // Per sicurezza controlliamo il nextElementSibling diretto
                        const nextRow = sourceRow.nextElementSibling;
                        if (nextRow && nextRow.style.display === 'none' && !nextRow.hasAttribute('data-ecc-cod')) {
                            // euristica debole, ma tentiamo
                            // sourceDetail = nextRow; 
                        }
                    }
                }

                // --- Logica Sincronizzazione ---
                // Cerchiamo se esiste già un clone nella destinazione con questo ID
                const existingClone = targetBody.querySelector(`tr[data-id-rich="${reqId}"]`);
                
                const sourceIsVisible = sourceRow.style.display !== 'none';
                const cloneIsMissing = !existingClone;

                if (sourceIsVisible || cloneIsMissing) {
                    // Pulizia vecchio clone (se esiste ma va aggiornato)
                    if (existingClone) {
                        const oldDetail = existingClone.nextElementSibling;
                        if (oldDetail && !oldDetail.hasAttribute('data-ecc-cod')) oldDetail.remove();
                        existingClone.remove();
                    }

                    // Pulizia placeholder "Nessun dato" se presente
                    const placeholder = targetBody.querySelector('td[colspan="100"]');
                    if (placeholder) placeholder.closest('tr').remove();

                    // --- Creazione Clone ---
                    const newMain = sourceRow.cloneNode(true);
                    
                    // IMPORTANTE: Normalizziamo l'ID sul clone così i check futuri funzionano
                    newMain.setAttribute('data-id-rich', reqId);
                    
                    newMain.style.display = ''; // Rendiamo visibile
                    newMain.style.cursor = 'pointer';
                    targetBody.appendChild(newMain);

                    // Gestione riga dettaglio (se trovata)
                    let newDetail = null;
                    if (sourceDetail) {
                        newDetail = sourceDetail.cloneNode(true);
                        newDetail.style.display = 'none';
                        newDetail.style.backgroundColor = '#f9f9f9';
                        targetBody.appendChild(newDetail);
                        sourceDetail.style.display = 'none'; 
                    }

                    // Nascondiamo l'originale
                    sourceRow.style.display = 'none'; 

                    // --- Fix Click per aprire dettaglio ---
                    // Rimuoviamo gli eventi onclick originali che potrebbero rompere la pagina
                    newMain.removeAttribute('onclick');
                    
                    // Aggiungiamo il toggle manuale
                    newMain.addEventListener('click', function(e) {
                        // Ignora click su bottoni o link interni
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
            console.log("aBetterPlace: Flessibilità sincronizzata (incluse richieste in attesa).");
        }
    },

    updateStats: function(table, titleElement) {
        let totalMinutesUsed = 0;
        const budgetMinutes = 600; // 10 Ore
        const timeRegex = /Dalle\s+(\d{1,2})[\.:](\d{2})\s+alle\s+(\d{1,2})[\.:](\d{2})/i;

        // Selezioniamo tutte le righe visibili nella tabella target
        // Nota: ora le righe clonate da "In attesa" hanno data-id-rich ma potrebbero non avere data-ecc-cod="FLH"
        // Quindi ci basiamo sul contenuto testo o sull'attributo normalizzato
        const rows = Array.from(table.querySelectorAll('tr'));
        
        rows.forEach(row => {
            if (row.style.display === 'none') return;
            
            // Filtro di sicurezza: deve sembrare una flessibilità
            const text = row.innerText;
            if (!text.toLowerCase().includes('flessibilita')) return;

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