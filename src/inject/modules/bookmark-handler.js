window.aBetterPlace = window.aBetterPlace || {};

window.aBetterPlace.BookmarkHandler = {
    process: function() {
        const anchors = document.querySelectorAll('#headerRight a, #menu a');

        anchors.forEach(anchor => {
            if (anchor.href.includes('/pagine/')) {
                try {
                    const url = new URL(anchor.href);

                    if (url.protocol === 'https:') {
                        if (url.port !== '11003') {
                            url.port = '11003';
                            anchor.href = url.toString();
                        }
                    }
                    
                } catch (e) {
                    console.warn("URL non valido trovato nel menu", anchor.href);
                }
            }
        });
    }
};