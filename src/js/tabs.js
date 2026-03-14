class TabManager {
    constructor() {
        this.botLoaded = false;
        this.initTabs();
    }

    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');

                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));

                e.target.classList.add('active');
                document.getElementById(`${targetTab}-tab`).classList.add('active');

                if (targetTab === 'bot' && !this.botLoaded) {
                    this.loadBot();
                }
            });
        });
    }

    loadBot() {
        const iframe = document.getElementById('kendrick-bot-frame');
        const placeholder = document.getElementById('bot-placeholder');
        const src = iframe.getAttribute('data-src');

        this.botLoaded = true;

        iframe.addEventListener('load', () => {
            if (iframe.src !== 'about:blank') {
                iframe.style.display = 'block';
                placeholder.style.display = 'none';
            }
        }, { once: true });

        iframe.src = src;
    }
}

const tabManager = new TabManager();
