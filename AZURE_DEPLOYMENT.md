# ☁️ Azure Deployment Guide

## Deploying Satellite Imagery Analyzer to Azure

### Prerequisites
- Azure account ([free trial](https://azure.microsoft.com/free))
- Azure CLI installed
- GitHub account

### Architecture on Azure

### Step 1: Frontend (Azure Static Web Apps)

```bash
# Install Azure Static Web Apps CLI
npm install -g @azure/static-web-apps-cli

# Build the frontend
cd client
npm run build

# Deploy
swa deploy ./dist --env production
```

Step 2: Backend (Azure App Service)

```bash
# Login to Azure
az login

# Create resource group
az group create --name SatelliteAnalyzerRG --location eastus

# Create App Service plan
az appservice plan create \
  --name SatelliteAnalyzerPlan \
  --resource-group SatelliteAnalyzerRG \
  --sku B1 \
  --is-linux

# Create Web App
az webapp create \
  --resource-group SatelliteAnalyzerRG \
  --plan SatelliteAnalyzerPlan \
  --name satellite-analyzer-api \
  --runtime "NODE:18-lts"

# Configure environment variables
az webapp config appsettings set \
  --resource-group SatelliteAnalyzerRG \
  --name satellite-analyzer-api \
  --settings \
    AI_SERVICE_URL=https://satellite-ai.azurecontainer.io \
    CLIENT_URL=https://your-app.azurestaticapps.net

# Deploy code
cd server
zip -r ../server.zip .
az webapp deployment source config-zip \
  --resource-group SatelliteAnalyzerRG \
  --name satellite-analyzer-api \
  --src ../server.zip
```

Step 3: AI Service (Azure Container Instances)

```bash
# Build Docker image
cd ai
docker build -t satellite-analyzer-ai .

# Push to Azure Container Registry
az acr create \
  --resource-group SatelliteAnalyzerRG \
  --name satelliteanalyzeracr \
  --sku Basic

az acr login --name satelliteanalyzeracr
docker tag satellite-analyzer-ai satelliteanalyzeracr.azurecr.io/ai:latest
docker push satelliteanalyzeracr.azurecr.io/ai:latest

# Deploy to Container Instances
az container create \
  --resource-group SatelliteAnalyzerRG \
  --name satellite-ai \
  --image satelliteanalyzeracr.azurecr.io/ai:latest \
  --cpu 1 \
  --memory 1.5 \
  --ports 8000 \
  --registry-login-server satelliteanalyzeracr.azurecr.io \
  --registry-username $(az acr credential show -n satelliteanalyzeracr --query username -o tsv) \
  --registry-password $(az acr credential show -n satelliteanalyzeracr --query passwords[0].value -o tsv)
```

Step 4: Database (Azure SQL or keep SQLite)

For simplicity, the app uses SQLite. For production, migrate to Azure SQL:

```bash
# Create Azure SQL Database
az sql server create \
  --name satellite-analyzer-sql \
  --resource-group SatelliteAnalyzerRG \
  --location eastus \
  --admin-user adminuser \
  --admin-password YourPassword123!

az sql db create \
  --resource-group SatelliteAnalyzerRG \
  --server satellite-analyzer-sql \
  --name satellite-analyzer-db \
  --service-objective Basic
```

Environment Variables for Production

Create these secrets in Azure Key Vault:

```bash
az keyvault create \
  --name SatelliteAnalyzerKV \
  --resource-group SatelliteAnalyzerRG \
  --location eastus

az keyvault secret set \
  --vault-name SatelliteAnalyzerKV \
  --name "MAPILLARY-TOKEN" \
  --value "MLY|your-token"

az keyvault secret set \
  --vault-name SatelliteAnalyzerKV \
  --name "NASA-API-KEY" \
  --value "your-nasa-key"
```

Continuous Deployment with GitHub Actions

Create .github/workflows/azure-deploy.yml:

```yaml
name: Deploy to Azure

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    
    steps:
    - uses: actions/checkout@v2
    
    - name: Deploy to Azure Static Web Apps
      uses: Azure/static-web-apps-deploy@v1
      with:
        azure_static_web_apps_api_token: ${{ secrets.AZURE_STATIC_WEB_APPS_TOKEN }}
        repo_token: ${{ secrets.GITHUB_TOKEN }}
        action: "upload"
        app_location: "/client"
        output_location: "dist"
    
    - name: Deploy Backend to App Service
      uses: azure/webapps-deploy@v2
      with:
        app-name: 'satellite-analyzer-api'
        publish-profile: ${{ secrets.AZURE_WEBAPP_PUBLISH_PROFILE }}
        package: './server'
    
    - name: Deploy AI to Container Instances
      run: |
        az container restart --name satellite-ai --resource-group SatelliteAnalyzerRG
```

Monitoring

```bash
# Set up Application Insights
az monitor app-insights component create \
  --app satellite-analyzer-insights \
  --location eastus \
  --resource-group SatelliteAnalyzerRG

# Enable logging
az webapp log config \
  --name satellite-analyzer-api \
  --resource-group SatelliteAnalyzerRG \
  --application-logging true \
  --web-server-logging filesystem
```

Cost Estimates (Monthly)

Service Tier Estimated Cost
Static Web Apps Free $0
App Service B1 ~$13
Container Instances 1 CPU, 1.5GB ~$30
SQL Database Basic ~$5
Total  ~$48/month

Scaling Tips

1. Start with Free tiers - Static Web Apps is always free
2. Use B1 App Service - $13/month handles moderate traffic
3. Consider serverless - Azure Functions for AI to reduce costs
4. Cache responses - Reduce API calls to NASA/OpenStreetMap

Troubleshooting

· Check logs: az webapp log tail --name satellite-analyzer-api --resource-group SatelliteAnalyzerRG
· Restart services: az container restart --name satellite-ai --resource-group SatelliteAnalyzerRG
· Verify environment variables: Check Azure Portal → App Service → Configuration

For detailed help, visit Azure Documentation
