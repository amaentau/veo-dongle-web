// Configuration for Veo Dongle Web App

const CONFIG = {
    // API Configuration
    API_BASE_URL: 'https://veo-dongle-api.azurewebsites.net', // Azure Functions API

    // Azure SignalR Configuration (will be set after Azure setup)
    SIGNALR_CONNECTION_STRING: '',

    // Azure Functions URLs (will be set after deployment)
    FUNCTIONS_BASE_URL: '',

    // WebSocket/Real-time configuration
    RECONNECT_INTERVAL: 5000,
    MAX_RECONNECT_ATTEMPTS: 5,

    // UI Configuration
    TOAST_DURATION: 3000,
    DEBOUNCE_DELAY: 300,

    // Device polling intervals
    DEVICE_POLL_INTERVAL: 30000, // 30 seconds
    STATUS_UPDATE_INTERVAL: 5000, // 5 seconds
};

// Load configuration from localStorage
function loadConfig() {
    const savedConfig = localStorage.getItem('veoDongleConfig');
    if (savedConfig) {
        try {
            const parsed = JSON.parse(savedConfig);
            Object.assign(CONFIG, parsed);
        } catch (error) {
            console.warn('Failed to load saved configuration:', error);
        }
    }
}

// Save configuration to localStorage
function saveConfig() {
    try {
        localStorage.setItem('veoDongleConfig', JSON.stringify(CONFIG));
    } catch (error) {
        console.error('Failed to save configuration:', error);
    }
}

// Update API base URL
function updateApiUrl(url) {
    CONFIG.API_BASE_URL = url;
    saveConfig();
}

// Initialize configuration
loadConfig();

// Export for use in other modules
window.VeoConfig = CONFIG;

