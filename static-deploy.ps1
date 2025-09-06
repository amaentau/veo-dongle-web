# Alternative Deployment Script for Veo Dongle Web App
# This script helps deploy without requiring Azure CLI installation

Write-Host "Veo Dongle Web App - Alternative Deployment Options" -ForegroundColor Green
Write-Host "==================================================" -ForegroundColor Green

Write-Host "`nOption 1: Deploy to GitHub Pages (Free)" -ForegroundColor Yellow
Write-Host "1. Create a GitHub repository" -ForegroundColor White
Write-Host "2. Push the web-app folder to GitHub" -ForegroundColor White
Write-Host "3. Enable GitHub Pages in repository settings" -ForegroundColor White
Write-Host "4. Your site will be available at: https://yourusername.github.io/repository-name" -ForegroundColor White

Write-Host "`nOption 2: Deploy to Netlify (Free)" -ForegroundColor Yellow
Write-Host "1. Go to https://netlify.com" -ForegroundColor White
Write-Host "2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "3. Connect your repository" -ForegroundColor White
Write-Host "4. Set build command: 'echo no build required'" -ForegroundColor White
Write-Host "5. Set publish directory: 'web-app'" -ForegroundColor White

Write-Host "`nOption 3: Deploy to Vercel (Free)" -ForegroundColor Yellow
Write-Host "1. Go to https://vercel.com" -ForegroundColor White
Write-Host "2. Sign up/Login with GitHub" -ForegroundColor White
Write-Host "3. Import your repository" -ForegroundColor White
Write-Host "4. Set root directory to 'web-app'" -ForegroundColor White
Write-Host "5. Deploy" -ForegroundColor White

Write-Host "`nOption 4: Manual FTP/Web Server Upload" -ForegroundColor Yellow
Write-Host "1. Get web hosting (free options: 000webhost, InfinityFree)" -ForegroundColor White
Write-Host "2. Upload all files from web-app/ folder" -ForegroundColor White
Write-Host "3. Your site will be available at your hosting URL" -ForegroundColor White

Write-Host "`nOption 5: Local Development Server" -ForegroundColor Yellow
Write-Host "1. Install Python (if not installed)" -ForegroundColor White
Write-Host "2. Run: python -m http.server 8080" -ForegroundColor White
Write-Host "3. Open: http://localhost:8080 in browser" -ForegroundColor White

Write-Host "`nCurrent Configuration:" -ForegroundColor Cyan
Write-Host "- API Base URL: http://localhost:4000 (for local backend)" -ForegroundColor White
Write-Host "- Update this in Settings when deploying" -ForegroundColor White

Write-Host "`nNext Steps:" -ForegroundColor Green
Write-Host "1. Choose a deployment option above" -ForegroundColor White
Write-Host "2. Update the API URL in the web app settings" -ForegroundColor White
Write-Host "3. Test device discovery and control" -ForegroundColor White
Write-Host "4. Share the URL with your users!" -ForegroundColor White

Write-Host "`nNeed help with any deployment option?" -ForegroundColor Yellow
