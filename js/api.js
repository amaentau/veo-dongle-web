// API Service for Veo Dongle Web App

class ApiService {
    constructor() {
        this.baseUrl = window.VeoConfig.API_BASE_URL;
        this.signalRConnection = null;
        this.deviceStatusCallbacks = new Map();
        this.connectionStatusCallback = null;
    }

    // Update base URL
    setBaseUrl(url) {
        this.baseUrl = url;
        window.VeoConfig.API_BASE_URL = url;
    }

    // HTTP API Methods
    async getDevices() {
        try {
            const response = await fetch(`${this.baseUrl}/devices`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching devices:', error);
            throw new Error('Failed to load devices. Please check your connection.');
        }
    }

    async sendCommand(deviceId, command, params = {}) {
        try {
            let url, method = 'POST', body = null;

            if (command === 'stream') {
                url = `${this.baseUrl}/control/${deviceId}/stream`;
                body = JSON.stringify({ veoUrl: params.veoUrl });
            } else {
                url = `${this.baseUrl}/control/${deviceId}/${command}`;
                body = JSON.stringify(params);
            }

            const response = await fetch(url, {
                method,
                headers: {
                    'Content-Type': 'application/json',
                },
                body
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            return await response.json();
        } catch (error) {
            console.error(`Error sending ${command} command:`, error);
            throw new Error(`Failed to send ${command} command: ${error.message}`);
        }
    }

    async getDeviceStatus(deviceId) {
        try {
            const response = await fetch(`${this.baseUrl}/devices/${deviceId}/status`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Error fetching device status:', error);
            throw error;
        }
    }

    // Real-time connection methods
    async connectSignalR() {
        if (this.signalRConnection) {
            await this.disconnectSignalR();
        }

        try {
            this.signalRConnection = new signalR.HubConnectionBuilder()
                .withUrl(`${this.baseUrl}/hub`)
                .withAutomaticReconnect()
                .build();

            // Set up event handlers
            this.signalRConnection.on('device-status', (data) => {
                this.handleDeviceStatusUpdate(data);
            });

            this.signalRConnection.on('command-result', (data) => {
                this.handleCommandResult(data);
            });

            this.signalRConnection.onclose(() => {
                this.updateConnectionStatus('disconnected');
            });

            this.signalRConnection.onreconnected(() => {
                this.updateConnectionStatus('connected');
            });

            await this.signalRConnection.start();
            this.updateConnectionStatus('connected');
            console.log('SignalR connected');

        } catch (error) {
            console.error('SignalR connection failed:', error);
            this.updateConnectionStatus('disconnected');
            throw error;
        }
    }

    async disconnectSignalR() {
        if (this.signalRConnection) {
            await this.signalRConnection.stop();
            this.signalRConnection = null;
            this.updateConnectionStatus('disconnected');
        }
    }

    // Device status monitoring
    subscribeToDeviceStatus(deviceId, callback) {
        this.deviceStatusCallbacks.set(deviceId, callback);
        return () => {
            this.deviceStatusCallbacks.delete(deviceId);
        };
    }

    setConnectionStatusCallback(callback) {
        this.connectionStatusCallback = callback;
    }

    // Event handlers
    handleDeviceStatusUpdate(data) {
        const { deviceId, status } = data;
        const callback = this.deviceStatusCallbacks.get(deviceId);
        if (callback) {
            callback(status);
        }
    }

    handleCommandResult(data) {
        console.log('Command result:', data);
        // Handle command results (success/error messages)
    }

    updateConnectionStatus(status) {
        if (this.connectionStatusCallback) {
            this.connectionStatusCallback(status);
        }
    }

    // Health check
    async checkHealth() {
        try {
            const response = await fetch(`${this.baseUrl}/health`);
            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }
            return await response.json();
        } catch (error) {
            console.error('Health check failed:', error);
            throw error;
        }
    }

    // Utility methods
    async testConnection() {
        try {
            await this.checkHealth();
            return true;
        } catch (error) {
            return false;
        }
    }
}

// Create singleton instance
const apiService = new ApiService();

// Export for global use
window.ApiService = apiService;
