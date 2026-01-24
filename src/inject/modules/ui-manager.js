window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.UIManager = {
    showToast: function(message, title = "", titleColor = '#26affb', duration = 3000) {
        const id = 'better-toast';
        const oldToast = document.getElementById(id);
        if (oldToast) oldToast.remove();

        const toast = document.createElement('div');
        toast.id = id;
        
        // Stili inline per il toast
        const styles = {
            position: 'fixed', bottom: '20px', left: '50%', transform: 'translateX(-50%)',
            backgroundColor: 'rgba(50, 50, 50, 0.95)', color: '#fff',
            padding: '12px 24px', borderRadius: '8px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.3)', zIndex: '99999',
            fontFamily: 'Segoe UI, sans-serif', fontSize: '14px',
            textAlign: 'center', minWidth: '300px', pointerEvents: 'auto',
            transition: 'opacity 0.3s ease'
        };
        Object.assign(toast.style, styles);

        const titleHtml = title ? `<div style="font-weight: bold; margin-bottom: 4px; font-size: 1.1em; color: ${titleColor};">${title}</div>` : '';
        toast.innerHTML = `${titleHtml}<div>${message}</div>`;

        document.body.appendChild(toast);

        // Auto-rimozione
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => { if (toast.parentNode) toast.remove(); }, 300);
        }, duration);
    }
};