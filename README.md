# Veo Dongle Web Control

A web-based replacement for the Veo Dongle mobile app that allows you to control Raspberry Pi devices running the Veo player through any web browser.

## Features

- **Device Discovery**: Automatically discovers connected Raspberry Pi devices
- **Real-time Status**: Live status updates for all connected devices
- **Stream Control**: Play, pause, and fullscreen controls for video playback
- **URL Streaming**: Send Veo stream URLs to devices for immediate playback
- **Cross-platform**: Works on any device with a web browser
- **No Installation**: Just open in your browser

## Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Web Browser   │────│ Azure Functions │────│   Raspberry Pi  │
│   (HTML/JS)     │    │     (API)       │    │    (Player)     │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         └───────────────────────┼───────────────────────┘
                         ┌─────────────────┐
                         │ Azure SignalR   │
                         │ (Real-time)     │
                         └─────────────────┘
```

## Prerequisites

- Azure subscription (free tier available)
- Node.js 18+ for local development
- Raspberry Pi devices running the Veo player backend

## Azure Setup

### 1. Create Azure Resources

Run the setup script:

```bash
# Clone or download the azure-web-setup.sh script
chmod +x azure-web-setup.sh
./azure-web-setup.sh
```

Or manually create resources in Azure Portal:

1. **Resource Group**: `veo-dongle-rg`
2. **SignalR Service**: Free tier (20 concurrent connections)
3. **Cosmos DB**: Free tier (5GB storage)
4. **Function App**: Consumption plan (1M executions/month free)
5. **Storage Account**: For Function App

### 2. Configure Environment Variables

After creating Azure resources, update your configuration:

```javascript
// In js/config.js
const CONFIG = {
    API_BASE_URL: 'https://your-function-app.azurewebsites.net',
    SIGNALR_CONNECTION_STRING: 'your-signalr-connection-string',
    // ... other config
};
```

## Local Development

### Running Locally

1. **Start your backend server** (existing cloud service):
   ```bash
   cd ../cloud
   npm install
   npm start
   ```

2. **Open the web app**:
   - Open `web-app/index.html` in your browser
   - Or use a local server:
   ```bash
   cd web-app
   python -m http.server 8080
   # Open http://localhost:8080
   ```

3. **Configure API URL**:
   - Go to Settings in the web app
   - Set API Base URL to `http://localhost:4000`

## Usage

### Device Management

1. **View Devices**: The main screen shows all connected Raspberry Pi devices
2. **Device Status**: Real-time status indicators (online/offline)
3. **Device Control**: Tap any device to access control options

### Stream Control

1. **Basic Controls**:
   - **Play**: Start video playback
   - **Pause**: Pause current video
   - **Fullscreen**: Toggle fullscreen mode

2. **Stream URLs**:
   - Enter Veo stream URL in the input field
   - Click "Send Stream" to start playback
   - Use "Use Example" for a sample URL

### Settings

- **API Base URL**: Configure your backend service URL
- **Connection Status**: Monitor real-time connection status

## API Endpoints

The web app communicates with your existing backend API:

```
GET    /devices              # List all devices
GET    /devices/:id/status   # Get device status
POST   /control/:id/play     # Send play command
POST   /control/:id/pause    # Send pause command
POST   /control/:id/fullscreen # Send fullscreen command
POST   /control/:id/stream   # Send Veo URL for streaming
```

## Real-time Features

- **Device Status Updates**: Live status changes via SignalR
- **Connection Monitoring**: Automatic reconnection on network issues
- **Command Feedback**: Real-time command acknowledgments

## Browser Support

- Chrome 80+
- Firefox 75+
- Safari 13+
- Edge 80+

## Troubleshooting

### Connection Issues

1. **Check API URL**: Ensure the API Base URL in Settings is correct
2. **Network Connectivity**: Verify your device can reach the backend
3. **CORS**: Ensure your backend allows cross-origin requests

### Device Not Showing

1. **Backend Running**: Ensure your Raspberry Pi backend is running
2. **Network**: Verify devices are on the same network
3. **Registration**: Check device registration in your backend

### Real-time Updates Not Working

1. **SignalR Connection**: Check browser console for SignalR errors
2. **Fallback**: The app falls back to polling if real-time fails

## Deployment

### Azure Static Web Apps

1. **Push to GitHub**:
   ```bash
   git add .
   git commit -m "Add Veo Dongle web app"
   git push origin main
   ```

2. **Deploy to Azure**:
   - Connect your GitHub repo to Azure Static Web Apps
   - Configure build settings (app location: `web-app`)
   - Deploy automatically on push

### Manual Deployment

1. **Build the app** (if needed):
   ```bash
   cd web-app
   # Add build steps if you use a bundler
   ```

2. **Upload to web server**:
   - Upload all files to your web server
   - Ensure CORS is configured for your API

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test locally
5. Submit a pull request

## License

This project is part of the Veo Dongle system. See the main project for licensing information.

