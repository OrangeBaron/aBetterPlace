window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.ThePlace = {
    init: function() {
        const mobileBreakpoint = 767; 
        if (window.innerWidth > mobileBreakpoint) return;

        if (document.getElementById('abp-mobile-header')) return;

        this.injectInterface();
    },

    injectInterface: function() {
        // --- 0. SAFETY CHECK ---
        const desktopNav = document.querySelector('#menu .nav-main.hidden-xs');
        if (!desktopNav) return;

        // --- 1. Generazione Dinamica Menu ---
        const menuItems = [];
        const cleanText = (text) => text ? text.replace(/\s+/g, ' ').trim() : '';

        const allItems = desktopNav.querySelectorAll('li');

        allItems.forEach(li => {
            // Caso 1: Separatori
            if (li.querySelector('hr')) {
                const lastItem = menuItems[menuItems.length - 1];
                if (lastItem && !lastItem.separator) {
                    menuItems.push({ separator: true });
                }
                return;
            }

            // Caso 2: Link effettivi
            if (!li.classList.contains('nav-parent')) {
                const anchor = li.querySelector('a');
                if (anchor) {
                    const label = cleanText(anchor.textContent);
                    
                    if (label) {
                        menuItems.push({ label: label, url: anchor.href });
                    }
                }
            }
        });
        
        if (menuItems.length > 0 && menuItems[menuItems.length - 1].separator) {
            menuItems.pop();
        }

        if (menuItems.length === 0) return;

        // --- 2. Inietta il CSS ---
        const logoUrl = chrome.runtime.getURL("assets/logo.png");
        
        const style = document.createElement('style');
        style.textContent = `
            /* Nascondi header originale */
            #header { display: none !important; }
            
            /* --- HEADER VERDE --- */
            #abp-mobile-header {
                position: fixed; top: 0; left: 0; right: 0;
                height: 56px;
                background-color: #4CAF50;
                display: flex; align-items: center; justify-content: space-between;
                padding: 0 16px;
                z-index: 10000;
                box-shadow: 0 2px 4px rgba(0,0,0,0.2);
                color: white;
            }

            #abp-hamburger {
                background: none; border: none; color: white;
                font-size: 28px; cursor: pointer; padding: 0;
                line-height: 1;
            }

            #abp-header-logo {
                height: 40px; 
                object-fit: contain;
            }

            /* --- DRAWER --- */
            #abp-drawer {
                position: fixed; top: 0; left: -300px;
                width: 280px; height: 100%;
                background: white;
                z-index: 10002;
                transition: transform 0.3s ease;
                box-shadow: 2px 0 12px rgba(0,0,0,0.3);
                overflow-y: auto;
                display: flex; flex-direction: column;
            }
            #abp-drawer.open { transform: translateX(300px); }

            .abp-drawer-header {
                background-color: #4CAF50;
                padding: 20px;
                display: flex; align-items: center; justify-content: center;
                border-bottom: 1px solid #388E3C;
            }
            .abp-drawer-header img {
                max-width: 100%; height: 50px; object-fit: contain;
            }

            .abp-menu-list { list-style: none; padding: 0; margin: 0; padding-bottom: 50px; }
            .abp-menu-item { display: block; }
            .abp-menu-link {
                display: flex; align-items: center;
                padding: 14px 20px;
                color: #333; text-decoration: none;
                font-family: 'Segoe UI', sans-serif; font-size: 15px;
                border-bottom: 1px solid #f5f5f5;
                transition: background 0.2s;
            }
            .abp-menu-link:hover { background-color: #e8f5e9; }
            
            .abp-separator {
                border: 0; 
                border-top: 5px solid #f0f0f0;
                margin: 0;
            }

            /* --- OVERLAY --- */
            #abp-overlay {
                position: fixed; top: 0; left: 0; right: 0; bottom: 0;
                background: rgba(0,0,0,0.5);
                z-index: 10001;
                display: none;
                opacity: 0; transition: opacity 0.3s;
            }
            #abp-overlay.visible { display: block; opacity: 1; }
        `;
        document.head.appendChild(style);

        // --- 3. Crea HTML Header ---
        const headerHTML = `
            <button id="abp-hamburger">☰</button>
            <img src="${logoUrl}" id="abp-header-logo" alt="a Better Place">
            <div style="width: 28px;"></div> `;
        const headerDiv = document.createElement('div');
        headerDiv.id = 'abp-mobile-header';
        headerDiv.innerHTML = headerHTML;
        document.body.prepend(headerDiv);

        // --- 4. Crea HTML Drawer ---
        const drawerDiv = document.createElement('div');
        drawerDiv.id = 'abp-drawer';
        
        let drawerContent = `
            <div class="abp-drawer-header">
                <img src="${logoUrl}" alt="a Better Place">
            </div>
            <ul class="abp-menu-list">
        `;

        menuItems.forEach(item => {
            if (item.separator) {
                drawerContent += `<li class="abp-menu-item"><hr class="abp-separator"></li>`;
            } else {
                drawerContent += `
                    <li class="abp-menu-item">
                        <a href="${item.url}" class="abp-menu-link">
                            ${item.label}
                        </a>
                    </li>
                `;
            }
        });

        drawerContent += `</ul>`;
        drawerDiv.innerHTML = drawerContent;
        document.body.appendChild(drawerDiv);

        // --- 5. Crea Overlay ---
        const overlayDiv = document.createElement('div');
        overlayDiv.id = 'abp-overlay';
        document.body.appendChild(overlayDiv);

        // --- 6. Logica Javascript ---
        const hamburger = document.getElementById('abp-hamburger');
        const overlay = document.getElementById('abp-overlay');
        const drawer = document.getElementById('abp-drawer');

        function toggleMenu() {
            const isOpen = drawer.classList.contains('open');
            if (isOpen) {
                drawer.classList.remove('open');
                overlay.classList.remove('visible');
                setTimeout(() => { overlay.style.display = 'none'; }, 300); 
            } else {
                overlay.style.display = 'block';
                setTimeout(() => { 
                    drawer.classList.add('open');
                    overlay.classList.add('visible');
                }, 10);
            }
        }

        hamburger.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);
    }
};