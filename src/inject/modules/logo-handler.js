window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.LogoHandler = {
    process: function(options) {
        if (options && !options.customLogo) return;

        const img = document.querySelector('img[class="img-responsive standard-logo"]');

        if (!img || img.src.includes('chrome-extension://')) return;

        const newLogoUrl = chrome.runtime.getURL('assets/logo.png');

        img.src = newLogoUrl;
        img.setAttribute("width", "146");
        img.setAttribute("height", "40");
        img.style.width = ""; 
        img.style.height = "";
    }
};