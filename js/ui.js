// UI Management for Veo Dongle Web App

class UIManager {
    constructor() {
        this.currentPage = 'devices';
        this.currentDevice = null;
        this.toastQueue = [];
        this.isLoading = false;
    }

    // Page Navigation
    showPage(pageName) {
        // Hide all pages
        document.querySelectorAll('.page').forEach(page => {
            page.classList.remove('active');
        });

        // Show selected page
        const targetPage = document.getElementById(`${pageName}Page`);
        if (targetPage) {
            targetPage.classList.add('active');
        }

        // Update navigation
        document.querySelectorAll('.nav-button').forEach(button => {
            button.classList.remove('active');
            if (button.dataset.page === pageName) {
                button.classList.add('active');
            }
        });

        this.currentPage = pageName;
    }

    // Device List Management
    updateDevicesList(devices) {
        const devicesList = document.getElementById('devicesList');
        const loadingSpinner = document.getElementById('devicesLoading');

        // Hide loading spinner
        if (loadingSpinner) {
            loadingSpinner.style.display = 'none';
        }

        if (!devices || devices.length === 0) {
            devicesList.innerHTML = `
                <div class="empty-state">
                    <span class="material-icons">devices_other</span>
                    <h3>No devices found</h3>
                    <p>Make sure your Veo Dongle devices are connected and running</p>
                </div>
            `;
            return;
        }

        devicesList.innerHTML = devices.map(device => this.createDeviceCard(device)).join('');
    }

    createDeviceCard(device) {
        const statusClass = this.getStatusClass(device.status);
        const lastSeen = device.lastSeen ? new Date(device.lastSeen).toLocaleString() : 'Never';

        return `
            <div class="device-card" data-device-id="${device.id}" onclick="app.selectDevice('${device.id}')">
                <div class="device-info">
                    <div class="device-name">${device.name}</div>
                    <div class="device-status">
                        Status: ${device.status || 'Unknown'}
                        <span class="device-status-indicator">
                            <span class="status-indicator ${statusClass}"></span>
                        </span>
                    </div>
                    <div class="device-last-seen">Last seen: ${lastSeen}</div>
                </div>
            </div>
        `;
    }

    getStatusClass(status) {
        switch (status) {
            case 'connected':
            case 'online':
                return 'online';
            case 'disconnected':
            case 'offline':
                return 'offline';
            default:
                return 'unknown';
        }
    }

    // Device Control UI
    showDeviceControl(device) {
        this.currentDevice = device;

        // Update device info
        document.getElementById('deviceControlTitle').textContent = `Control: ${device.name}`;
        document.getElementById('deviceName').textContent = device.name;
        document.getElementById('deviceId').textContent = device.id;
        document.getElementById('deviceStatusText').textContent = device.status || 'Unknown';
        document.getElementById('deviceStatusIndicator').className = `status-indicator ${this.getStatusClass(device.status)}`;

        // Enable/disable controls based on device status
        const isConnected = device.status === 'connected' || device.status === 'online';
        this.updateControlButtons(isConnected);

        // Show device control page
        this.showPage('deviceControl');
    }

    updateControlButtons(enabled) {
        const buttons = ['playButton', 'pauseButton', 'fullscreenButton'];
        buttons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.disabled = !enabled;
            }
        });
    }

    updateDeviceStatus(deviceId, status) {
        if (this.currentDevice && this.currentDevice.id === deviceId) {
            this.currentDevice.status = status;
            document.getElementById('deviceStatusText').textContent = status;
            document.getElementById('deviceStatusIndicator').className = `status-indicator ${this.getStatusClass(status)}`;
            this.updateControlButtons(status === 'connected' || status === 'online');
        }
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

    // Form Handling
    populateStreamUrlForm() {
        const urlInput = document.getElementById('veoUrl');
        if (urlInput) {
            urlInput.value = 'https://live.veo.co/stream/8526b303-fb9f-4088-aecc-146eb39403d6@1756825266223';
        }
    }

    clearStreamUrlForm() {
        const urlInput = document.getElementById('veoUrl');
        if (urlInput) {
            urlInput.value = '';
        }
    }

    // Connection Status
    updateConnectionStatus(status) {
        const statusDot = document.getElementById('statusDot');
        const statusText = document.getElementById('statusText');

        if (statusDot && statusText) {
            statusDot.className = `status-dot ${status}`;
            statusText.textContent = status.charAt(0).toUpperCase() + status.slice(1);
        }
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

        // Back button
        const backButton = document.getElementById('backToDevices');
        if (backButton) {
            backButton.addEventListener('click', () => {
                this.showPage('devices');
            });
        }

        // Refresh devices
        const refreshButton = document.getElementById('refreshDevices');
        if (refreshButton) {
            refreshButton.addEventListener('click', () => {
                if (window.app) {
                    window.app.loadDevices();
                }
            });
        }

        // Control buttons
        const controlButtons = ['playButton', 'pauseButton', 'fullscreenButton'];
        controlButtons.forEach(buttonId => {
            const button = document.getElementById(buttonId);
            if (button) {
                button.addEventListener('click', (e) => {
                    const command = buttonId.replace('Button', '');
                    if (window.app && this.currentDevice) {
                        window.app.sendCommand(this.currentDevice.id, command.toLowerCase());
                    }
                });
            }
        });

        // Stream URL form
        const streamForm = document.getElementById('streamUrlForm');
        if (streamForm) {
            streamForm.addEventListener('submit', (e) => {
                e.preventDefault();
                const urlInput = document.getElementById('veoUrl');
                if (urlInput && urlInput.value && window.app && this.currentDevice) {
                    window.app.sendStreamUrl(this.currentDevice.id, urlInput.value);
                }
            });
        }

        // Fill example URL
        const fillExampleButton = document.getElementById('fillExample');
        if (fillExampleButton) {
            fillExampleButton.addEventListener('click', () => {
                this.populateStreamUrlForm();
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
        this.showPage('devices');
    }
}

// Create singleton instance
const uiManager = new UIManager();

// Export for global use
window.UIManager = uiManager;
