window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.OtpHandler = {
    process: function() {
        // --- 1. AUTOCOMPLETE FIX ---
        const userField = document.getElementById("username");
        const passField = document.getElementById("password");

        if (userField) userField.setAttribute("autocomplete", "username");
        if (passField) passField.setAttribute("autocomplete", "current-password");

        // --- 2. GESTIONE OTP & PROXY ---
        const targetIds = ["password#2", "password_14"];
        const smsBtn = document.getElementById("conpin"); 

        targetIds.forEach(originalId => {
            const originalInput = document.getElementById(originalId);

            if (originalInput && !document.getElementById(originalId + '_proxy')) {
                
                // Creiamo la controfigura
                const proxyInput = document.createElement('input');
                proxyInput.id = originalId + '_proxy'; 
                proxyInput.name = 'otp_safe_field';
                proxyInput.type = 'text'; 
                proxyInput.setAttribute('autocomplete', 'one-time-code');
                proxyInput.className = originalInput.className;
                proxyInput.style.cssText = originalInput.style.cssText;
                
                if (originalInput.placeholder) proxyInput.placeholder = originalInput.placeholder;

                // Aggiorniamo l'originale
                proxyInput.addEventListener('input', function() {
                    originalInput.value = this.value;
                });

                proxyInput.addEventListener('keydown', function(e) {
                    if (e.key === 'Enter') {
                        e.preventDefault();

                        if (originalId === "password#2" && !this.value && smsBtn) {
                            smsBtn.click();
                            return;
                        }

                        const form = originalInput.form;
                        if (form) {
                            const submitBtn = form.querySelector('input[type="submit"], button[type="submit"]');
                            if (submitBtn) submitBtn.click();
                            else form.submit();
                        }
                    }
                });

                // Iniezione e nascondimento
                originalInput.parentNode.insertBefore(proxyInput, originalInput);
                
                originalInput.type = 'hidden';
                originalInput.removeAttribute('required');

                if (originalId === "password_14") {
                    proxyInput.focus();
                }
            }
        });

        // --- 3. REDIRECT ENTER SU USERNAME/PASSWORD ---
        this.attachEnterRedirect(smsBtn);
    },

    attachEnterRedirect: function(smsBtn) {
        const appOtpInput = document.getElementById("password#2");
        
        if (!appOtpInput || !smsBtn) return;

        ["username", "password"].forEach(id => {
            const input = document.getElementById(id);
            if (input) {
                input.addEventListener("keydown", (e) => {
                    if (e.key === "Enter") {
                        if (!appOtpInput.value) {
                            e.preventDefault();
                            e.stopImmediatePropagation();
                            smsBtn.click();
                        }
                    }
                });
            }
        });
    }
};