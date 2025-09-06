// Main Application Logic for simplified Veo URL Publisher

class VeoDongleApp {
    async init() {
        window.UIManager.init();
    }

    async publishUrl(deviceId, veoUrl) {
        try {
            window.UIManager.showLoading('Publishing URL...');
            await window.ApiService.publishUrl(deviceId, veoUrl);
            window.UIManager.showSuccess('URL published successfully');
            window.UIManager.clearPublishForm();
        } catch (error) {
            console.error('Publish failed:', error);
            window.UIManager.showError(error.message || 'Publish failed');
        } finally {
            window.UIManager.hideLoading();
        }
    }

    async checkLatest(deviceId) {
        try {
            window.UIManager.showLoading('Fetching latest URL...');
            const result = await window.ApiService.getLatestUrl(deviceId);
            window.UIManager.showLatestResult(result.veoUrl || result.url || '', result.updatedAt || result.timestamp);
        } catch (error) {
            console.error('Fetch failed:', error);
            window.UIManager.showError(error.message || 'Fetch failed');
            window.UIManager.hideLatestResult();
        } finally {
            window.UIManager.hideLoading();
        }
    }
}

document.addEventListener('DOMContentLoaded', () => {
    window.app = new VeoDongleApp();
    window.app.init();
});

window.VeoDongleApp = VeoDongleApp;
