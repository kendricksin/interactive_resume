class TabManager {
    constructor() {
        this.initTabs();
    }

    initTabs() {
        const tabButtons = document.querySelectorAll('.tab-button');
        const tabPanes = document.querySelectorAll('.tab-pane');

        tabButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                const targetTab = e.target.getAttribute('data-tab');
                
                // Remove active class from all buttons and panes
                tabButtons.forEach(btn => btn.classList.remove('active'));
                tabPanes.forEach(pane => pane.classList.remove('active'));
                
                // Add active class to clicked button
                e.target.classList.add('active');
                
                // Show corresponding pane
                document.getElementById(`${targetTab}-tab`).classList.add('active');
            });
        });
    }
}

const tabManager = new TabManager();
