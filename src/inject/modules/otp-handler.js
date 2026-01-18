window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.OtpHandler = {
    process: function() {
        const targetIds = ["password#2", "password_14"];

        targetIds.forEach(originalId => {
            const originalInput = document.getElementById(originalId);

            if (originalInput && !document.getElementById(originalId + '_proxy')) {
                
                // 1. Creiamo la controfigura
                const proxyInput = document.createElement('input');
                proxyInput.id = originalId + '_proxy'; 
                proxyInput.name = 'otp_safe_field';
                proxyInput.type = 'text'; 
                proxyInput.setAttribute('autocomplete', 'one-time-code');
                proxyInput.className = originalInput.className;
                proxyInput.style.cssText = originalInput.style.cssText;
                
                if (originalInput.placeholder) proxyInput.placeholder = originalInput.placeholder;

                // 2. Aggiorniamo l'originale
                proxyInput.addEventListener('input', function() {
                    originalInput.value = this.value;
                });

                proxyInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();
                        const form = originalInput.form;
                        if (form) {
                            const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
                            if (submitBtn) submitBtn.click();
                            else form.submit();
                        }
                    }
                });

                // 3. INIEZIONE E NASCONDIMENTO
                originalInput.parentNode.insertBefore(proxyInput, originalInput);
                
                originalInput.type = 'hidden';
                originalInput.removeAttribute('required');

                console.log(`aBetterPlace: Proxy OTP attivo per ${originalId}.`);
            }
        });
    }
};