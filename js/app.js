// Main Application Logic for Veo Dongle Web App

class VeoDongleApp {
    constructor() {
        this.devices = [];
        this.selectedDevice = null;
        this.pollingInterval = null;
        this.statusInterval = null;
    }

    // Initialize the application
    async init() {
        console.log('Initializing Veo Dongle Web App...');

        // Initialize UI
        window.UIManager.init();

        // Setup API service callbacks
        window.ApiService.setConnectionStatusCallback((status) => {
            window.UIManager.updateConnectionStatus(status);
        });

        // Test connection and start
        await this.testConnection();
        await this.connectRealTime();
        await this.loadDevices();

        // Start polling
        this.startPolling();

        console.log('Veo Dongle Web App initialized');
    }

    // Connection testing
    async testConnection() {
        try {
            window.UIManager.showLoading('Testing connection...');
            const isConnected = await window.ApiService.testConnection();

            if (isConnected) {
                window.UIManager.updateConnectionStatus('connected');
                window.UIManager.showToast('Connected to server', 'success');
            } else {
                window.UIManager.updateConnectionStatus('disconnected');
                window.UIManager.showToast('Unable to connect to server', 'warning');
            }
        } catch (error) {
            console.error('Connection test failed:', error);
            window.UIManager.updateConnectionStatus('disconnected');
            window.UIManager.showToast('Connection test failed', 'error');
        } finally {
            window.UIManager.hideLoading();
        }
    }

    // Real-time connection
    async connectRealTime() {
        try {
            await window.ApiService.connectSignalR();
            console.log('Real-time connection established');
        } catch (error) {
            console.warn('Real-time connection failed, falling back to polling:', error);
            // Continue with polling-only mode
        }
    }

    // Device management
    async loadDevices() {
        try {
            window.UIManager.showLoading('Loading devices...');
            const devices = await window.ApiService.getDevices();
            this.devices = devices;
            window.UIManager.updateDevicesList(devices);
        } catch (error) {
            console.error('Failed to load devices:', error);
            window.UIManager.showError('Failed to load devices');
            window.UIManager.updateDevicesList([]);
        } finally {
            window.UIManager.hideLoading();
        }
    }

    selectDevice(deviceId) {
        const device = this.devices.find(d => d.id === deviceId);
        if (device) {
            this.selectedDevice = device;

            // Subscribe to device status updates
            window.ApiService.subscribeToDeviceStatus(deviceId, (status) => {
                this.handleDeviceStatusUpdate(deviceId, status);
            });

            window.UIManager.showDeviceControl(device);
        }
    }

    handleDeviceStatusUpdate(deviceId, status) {
        // Update device in our list
        const device = this.devices.find(d => d.id === deviceId);
        if (device) {
            device.status = status;
            device.lastSeen = new Date();
        }

        // Update UI
        window.UIManager.updateDeviceStatus(deviceId, status);
    }

    // Command handling
    async sendCommand(deviceId, command) {
        try {
            window.UIManager.showLoading(`Sending ${command} command...`);
            await window.ApiService.sendCommand(deviceId, command);
            window.UIManager.showSuccess(`${command} command sent successfully`);
        } catch (error) {
            console.error(`Failed to send ${command} command:`, error);
            window.UIManager.showError(`Failed to send ${command} command`);
        } finally {
            window.UIManager.hideLoading();
        }
    }

    async sendStreamUrl(deviceId, url) {
        try {
            window.UIManager.showLoading('Sending stream URL...');
            await window.ApiService.sendCommand(deviceId, 'stream', { veoUrl: url });
            window.UIManager.showSuccess('Stream URL sent successfully');
            window.UIManager.clearStreamUrlForm();
        } catch (error) {
            console.error('Failed to send stream URL:', error);
            window.UIManager.showError('Failed to send stream URL');
        } finally {
            window.UIManager.hideLoading();
        }
    }

    // Polling
    startPolling() {
        // Poll for device updates every 30 seconds
        this.pollingInterval = setInterval(() => {
            this.loadDevices();
        }, window.VeoConfig.DEVICE_POLL_INTERVAL);

        // Poll for device status updates every 5 seconds
        this.statusInterval = setInterval(() => {
            this.pollDeviceStatuses();
        }, window.VeoConfig.STATUS_UPDATE_INTERVAL);
    }

    stopPolling() {
        if (this.pollingInterval) {
            clearInterval(this.pollingInterval);
            this.pollingInterval = null;
        }
        if (this.statusInterval) {
            clearInterval(this.statusInterval);
            this.statusInterval = null;
        }
    }

    async pollDeviceStatuses() {
        if (this.devices.length === 0) return;

        try {
            const statusPromises = this.devices.map(device =>
                window.ApiService.getDeviceStatus(device.id).catch(() => null)
            );

            const statuses = await Promise.all(statusPromises);

            statuses.forEach((status, index) => {
                if (status) {
                    const device = this.devices[index];
                    this.handleDeviceStatusUpdate(device.id, status.status);
                }
            });
        } catch (error) {
            // Silently handle polling errors
            console.debug('Status polling error:', error);
        }
    }

    // Cleanup
    destroy() {
        this.stopPolling();
        if (window.ApiService) {
            window.ApiService.disconnectSignalR();
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new VeoDongleApp();
    window.app.init();
});

// Handle page unload
window.addEventListener('beforeunload', () => {
    if (window.app) {
        window.app.destroy();
    }
});

// Export for global use
window.VeoDongleApp = VeoDongleApp;
