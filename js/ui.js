// UI Management for simplified Veo URL Publisher

class UIManager {
    constructor() {
        this.currentPage = 'publish';
        this.toastQueue = [];
        this.isLoading = false;
    }

    // Page Navigation
    showPage(pageName) {
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });
        const targetPage = document.getElementById(`${pageName}Page`);
        if (targetPage) targetPage.classList.add('active');

        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.toggle('active', button.dataset.page === pageName);
        });

        this.currentPage = pageName;
    }

    // Loading States
    showLoading(message = 'Processing...') {
        if (this.isLoading) return;

        this.isLoading = true;
        const overlay = document.getElementById('loadingOverlay');
        const loadingText = document.getElementById('loadingText');

        if (overlay && loadingText) {
            loadingText.textContent = message;
            overlay.classList.remove('hidden');
        }
    }

    hideLoading() {
        this.isLoading = false;
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            overlay.classList.add('hidden');
        }
    }

    // Toast Notifications
    showToast(message, type = 'info', duration = 3000) {
        const toast = document.createElement('div');
        toast.className = `toast ${type}`;
        toast.innerHTML = `
            <div class="toast-content">
                <span class="toast-message">${message}</span>
            </div>
        `;

        const container = document.getElementById('toastContainer');
        if (container) {
            container.appendChild(toast);

            // Trigger animation
            setTimeout(() => toast.classList.add('show'), 10);

            // Auto remove
            setTimeout(() => {
                toast.classList.remove('show');
                setTimeout(() => {
                    if (toast.parentNode) {
                        toast.parentNode.removeChild(toast);
                    }
                }, 300);
            }, duration);
        }
    }

    // Form Helpers
    populateExample() {
        const idInput = document.getElementById('deviceIdInput');
        const urlInput = document.getElementById('veoUrlInput');
        if (idInput) idInput.value = 'demo-device-1';
        if (urlInput) urlInput.value = 'https://live.veo.co/stream/example@timestamp';
    }

    clearPublishForm() {
        const idInput = document.getElementById('deviceIdInput');
        const urlInput = document.getElementById('veoUrlInput');
        if (idInput) idInput.value = '';
        if (urlInput) urlInput.value = '';
    }

    showLatestResult(url, updatedAt) {
        const container = document.getElementById('latestResult');
        const urlField = document.getElementById('latestUrl');
        const timeField = document.getElementById('latestUpdatedAt');
        if (container && urlField && timeField) {
            urlField.value = url || '';
            timeField.value = updatedAt ? new Date(updatedAt).toLocaleString() : '';
            container.style.display = '';
        }
    }

    hideLatestResult() {
        const container = document.getElementById('latestResult');
        if (container) container.style.display = 'none';
    }

    // Settings
    loadSettings() {
        const apiUrl = document.getElementById('apiUrl');
        if (apiUrl) {
            apiUrl.value = window.VeoConfig.API_BASE_URL;
        }
    }

    saveSettings() {
        const apiUrl = document.getElementById('apiUrl');
        if (apiUrl && apiUrl.value) {
            window.VeoConfig.API_BASE_URL = apiUrl.value;
            window.ApiService.setBaseUrl(apiUrl.value);
            this.showToast('Settings saved successfully', 'success');
        }
    }

    // Error Handling
    showError(message) {
        this.showToast(message, 'error');
    }

    showSuccess(message) {
        this.showToast(message, 'success');
    }

    // Event Listeners Setup
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-button').forEach(button => {
            button.addEventListener('click', (e) => {
                const page = e.currentTarget.dataset.page;
                this.showPage(page);
            });
        });

        // Publish form
        const publishForm = document.getElementById('publishForm');
        if (publishForm) {
            publishForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const idInput = document.getElementById('deviceIdInput');
                const urlInput = document.getElementById('veoUrlInput');
                if (idInput && urlInput && idInput.value && urlInput.value && window.app) {
                    window.app.publishUrl(idInput.value.trim(), urlInput.value.trim());
                }
            });
        }

        // Fill example
        const fillExampleButton = document.getElementById('fillExample');
        if (fillExampleButton) {
            fillExampleButton.addEventListener('click', () => {
                this.populateExample();
            });
        }

        // Check form
        const checkForm = document.getElementById('checkForm');
        if (checkForm) {
            checkForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const idInput = document.getElementById('checkDeviceIdInput');
                if (idInput && idInput.value && window.app) {
                    window.app.checkLatest(idInput.value.trim());
                }
            });
        }

        // Settings
        const saveSettingsButton = document.getElementById('saveSettings');
        if (saveSettingsButton) {
            saveSettingsButton.addEventListener('click', () => {
                this.saveSettings();
            });
        }
    }

    // Initialize UI
    init() {
        this.setupEventListeners();
        this.loadSettings();
        this.showPage('publish');
    }
}

// Create singleton instance
const uiManager = new UIManager();

// Export for global use
window.UIManager = uiManager;
