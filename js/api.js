// Minimal API service for bulletin-board style URL publishing

class ApiService {
    constructor() {
        this.baseUrl = window.VeoConfig.API_BASE_URL;
    }

    setBaseUrl(url) {
        this.baseUrl = url;
        window.VeoConfig.API_BASE_URL = url;
    }

    // POST a new URL for a device
    async publishUrl(deviceId, veoUrl) {
        const response = await fetch(`${this.baseUrl}/url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ deviceId, veoUrl })
        });
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Publish failed (${response.status}): ${text || response.statusText}`);
        }
        return await response.json().catch(() => ({}));
    }

    // GET the latest URL for a device
    async getLatestUrl(deviceId) {
        const response = await fetch(`${this.baseUrl}/url/${encodeURIComponent(deviceId)}/latest`);
        if (!response.ok) {
            const text = await response.text().catch(() => '');
            throw new Error(`Fetch failed (${response.status}): ${text || response.statusText}`);
        }
        return await response.json();
    }

    async checkHealth() {
        const response = await fetch(`${this.baseUrl}/health`);
        return response.ok;
    }
}

const apiService = new ApiService();
window.ApiService = apiService;
