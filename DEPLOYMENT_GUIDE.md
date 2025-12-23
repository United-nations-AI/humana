# Deployment Guide - Humana AI Avatar

Complete guide for deploying Humana AI Avatar to production environments.

## 📋 Table of Contents

1. [Prerequisites](#prerequisites)
2. [Local Development Setup](#local-development-setup)
3. [Production Deployment](#production-deployment)
4. [Docker Deployment](#docker-deployment)
5. [Environment Configuration](#environment-configuration)
6. [Post-Deployment Verification](#post-deployment-verification)
7. [Monitoring & Maintenance](#monitoring--maintenance)
8. [Troubleshooting](#troubleshooting)

## Prerequisites

Before deploying, ensure you have:

- ✅ Azure account (for API deployment)
- ✅ Vercel account or similar (for web deployment)
- ✅ Supabase project (for authentication)
- ✅ OpenAI API key
- ✅ Domain name (optional, for custom domain)

## Local Development Setup

### Using Docker Compose (Recommended)

1. **Clone and navigate to project**
   ```bash
   git clone https://github.com/Mr-Infect/humana-AI-v2.git
   cd humana-AI-v2
   ```

2. **Create `.env` file**
   ```bash
   cp .env.example .env  # If you have an example file
   # Or create .env manually with all required variables
   ```

3. **Build and start containers**
   ```bash
   docker-compose build
   docker-compose up -d
   ```

4. **Verify services are running**
   ```bash
   docker-compose ps
   docker-compose logs -f
   ```

5. **Access the application**
   - Web: http://localhost:5000
   - API: http://localhost:4000/health

### Manual Setup (Without Docker)

**Terminal 1 - API:**
```bash
cd apps/api
npm install
npm run dev
```

**Terminal 2 - Web:**
```bash
cd apps/web
npm install
npm run dev
```

## Production Deployment

### Step 1: API Deployment (Azure Functions)

#### Prerequisites
- Azure account with active subscription
- Azure Functions Core Tools installed:
  ```bash
  npm install -g azure-functions-core-tools@4
  ```

#### Create Azure Functions App

```bash
# Login to Azure
az login

# Create resource group
az group create --name humana-rg --location eastus

# Create storage account
az storage account create \
  --name humanastorage \
  --location eastus \
  --resource-group humana-rg \
  --sku Standard_LRS

# Create Function App
az functionapp create \
  --resource-group humana-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name humana-api \
  --storage-account humanastorage
```

#### Configure Environment Variables

```bash
az functionapp config appsettings set \
  --name humana-api \
  --resource-group humana-rg \
  --settings \
    OPENAI_API_KEY="your_openai_key" \
    SUPABASE_URL="https://your-project.supabase.co" \
    SUPABASE_SERVICE_ROLE_KEY="your_service_role_key" \
    WEB_ORIGIN="https://your-domain.com" \
    NODE_ENV="production"
```

#### Deploy Functions

```bash
cd apps/api
npm install
npm run build
func azure functionapp publish humana-api
```

#### Verify Deployment

```bash
curl https://humana-api.azurewebsites.net/api/health
# Should return: {"ok":true}
```

### Step 2: Web Deployment (Vercel)

#### Prerequisites
- Vercel account (sign up at https://vercel.com)
- GitHub repository connected to Vercel

#### Import Project

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click "Add New Project"
3. Import your GitHub repository
4. Set **Root Directory** to `apps/web`
5. Framework preset: **Next.js**

#### Configure Environment Variables

In Vercel project settings, add:

```
NEXT_PUBLIC_API_BASE_URL=https://humana-api.azurewebsites.net/api
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
```

#### Deploy

- **Automatic**: Push to `main` branch triggers auto-deploy
- **Manual**: Click "Deploy" button in Vercel dashboard

#### Custom Domain (Optional)

1. Go to Vercel → Your Project → Settings → Domains
2. Add your custom domain
3. Configure DNS records as instructed
4. Update `WEB_ORIGIN` in Azure Functions to match your domain

### Step 3: Supabase Configuration

#### Authentication Setup

1. **Enable Email Provider**
   - Go to Supabase Dashboard → Authentication → Providers
   - Enable "Email" provider
   - Enable "Magic Link" option

2. **Configure URLs**
   - Go to Authentication → URL Configuration
   - Set **Site URL**: `https://your-domain.com`
   - Add **Redirect URLs**: 
     - `https://your-domain.com/chat`
     - `http://localhost:5000/chat` (for local testing)

3. **Email Templates**
   - Customize email templates in Authentication → Email Templates
   - Test magic link and verification emails

#### Update Environment Variables

After deploying, update production environment variables:
- Azure Functions: Use Azure Portal or CLI
- Vercel: Use Vercel Dashboard → Settings → Environment Variables

## Docker Deployment

### Building Docker Images

```bash
# Build API image
cd apps/api
docker build -t humana-api:latest .

# Build Web image
cd apps/web
docker build -t humana-web:latest -f Dockerfile .
```

### Running with Docker Compose

```bash
# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop services
docker-compose down
```

### Production Docker Compose

For production, use a production-ready `docker-compose.prod.yml`:

```yaml
version: '3.9'
services:
  api:
    image: humana-api:latest
    restart: always
    environment:
      - NODE_ENV=production
      - OPENAI_API_KEY=${OPENAI_API_KEY}
      - SUPABASE_URL=${SUPABASE_URL}
      - SUPABASE_SERVICE_ROLE_KEY=${SUPABASE_SERVICE_ROLE_KEY}
      - WEB_ORIGIN=${WEB_ORIGIN}
    ports:
      - "4000:4000"

  web:
    image: humana-web:latest
    restart: always
    environment:
      - NODE_ENV=production
      - NEXT_PUBLIC_API_BASE_URL=${NEXT_PUBLIC_API_BASE_URL}
      - NEXT_PUBLIC_SUPABASE_URL=${NEXT_PUBLIC_SUPABASE_URL}
      - NEXT_PUBLIC_SUPABASE_ANON_KEY=${NEXT_PUBLIC_SUPABASE_ANON_KEY}
    ports:
      - "5000:5000"
    depends_on:
      - api
```

## Environment Configuration

### Required Variables Summary

#### API Service (Azure Functions / Docker)
- `OPENAI_API_KEY` - OpenAI API key
- `SUPABASE_URL` - Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY` - Supabase service role key
- `WEB_ORIGIN` - Web app origin for CORS

#### Web Service (Vercel / Docker)
- `NEXT_PUBLIC_API_BASE_URL` - API base URL
- `NEXT_PUBLIC_SUPABASE_URL` - Supabase project URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY` - Supabase anonymous key

### Security Best Practices

1. **Never commit `.env` files**
   - Ensure `.env` is in `.gitignore`
   - Use environment variable management in hosting platforms

2. **Use different keys for dev/prod**
   - Create separate Supabase projects for development and production
   - Use separate OpenAI API keys with usage limits

3. **Rotate keys regularly**
   - Schedule regular key rotation
   - Update keys in all environments simultaneously

4. **Use secret management**
   - Azure: Azure Key Vault
   - Vercel: Environment Variables (encrypted)
   - Docker: Docker secrets or external secret management

## Post-Deployment Verification

### 1. Health Checks

```bash
# API Health
curl https://humana-api.azurewebsites.net/api/health
# Expected: {"ok":true}

# Web App
curl -I https://your-domain.com
# Expected: 200 OK
```

### 2. Authentication Flow

1. Visit https://your-domain.com/login
2. Test sign up with new email
3. Test magic link
4. Test sign in with credentials
5. Verify redirect to /chat

### 3. API Endpoints

Test authenticated endpoints (requires JWT token):

```bash
# Get token from login response or browser localStorage
TOKEN="your_jwt_token"

# Test chat endpoint
curl -X POST https://humana-api.azurewebsites.net/api/v1/chat \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}],"language":"en"}'
```

### 4. Language Switching

1. Login to chat interface
2. Change language using dropdown
3. Verify UI updates
4. Send message and verify response language

### 5. Voice Features

1. Test speech-to-text (microphone button)
2. Test text-to-speech (speaker button)
3. Verify audio playback works

## Monitoring & Maintenance

### Azure Functions Monitoring

1. **Application Insights**
   - Automatically enabled in Azure Functions
   - Monitor function execution times
   - Track errors and performance metrics
   - Set up alerts for failures

2. **Logs**
   ```bash
   az functionapp log tail --name humana-api --resource-group humana-rg
   ```

### Vercel Monitoring

1. **Analytics**
   - Enable in Vercel Dashboard → Analytics
   - Track web vitals and performance
   - Monitor page loads and errors

2. **Logs**
   - View real-time logs in Vercel Dashboard
   - Filter by deployment or function

### Supabase Monitoring

1. **Dashboard**
   - Monitor user authentication
   - Track database usage
   - View API usage statistics

2. **Logs**
   - Check Authentication logs for failed attempts
   - Monitor database queries

### Maintenance Tasks

**Weekly:**
- Review error logs
- Check API usage and costs
- Monitor user feedback

**Monthly:**
- Review and rotate API keys
- Update dependencies
- Review security logs
- Check resource usage and scaling needs

## Troubleshooting

### API Not Responding

**Symptoms:** 500 errors, timeouts, or health check failures

**Solutions:**
1. Check Azure Functions logs:
   ```bash
   az functionapp log tail --name humana-api --resource-group humana-rg
   ```
2. Verify environment variables are set correctly
3. Check OpenAI API key is valid and has credits
4. Verify Supabase credentials are correct

### Authentication Errors

**Symptoms:** "Invalid token", "Unauthorized", login failures

**Solutions:**
1. Verify Supabase URL and keys match between environments
2. Check JWT token expiration (tokens expire after 1 hour)
3. Verify CORS settings in Supabase dashboard
4. Check Site URL and Redirect URLs are configured correctly

### Web App Not Loading

**Symptoms:** Blank page, 404 errors, build failures

**Solutions:**
1. Check Vercel deployment logs
2. Verify all `NEXT_PUBLIC_*` environment variables are set
3. Check browser console for errors
4. Verify API base URL is correct
5. Rebuild and redeploy if needed

### Language Switching Not Working

**Symptoms:** UI doesn't update, API responses in wrong language

**Solutions:**
1. Hard refresh browser (Cmd+Shift+R / Ctrl+Shift+R)
2. Clear browser cache
3. Check browser console for JavaScript errors
4. Verify language parameter is sent in API requests

### High Costs

**Symptoms:** Unexpected OpenAI API charges

**Solutions:**
1. Set usage limits in OpenAI dashboard
2. Monitor API usage in Azure Application Insights
3. Implement rate limiting
4. Review chat message limits per user

## Scaling

### Azure Functions

- **Automatic Scaling**: Functions auto-scale based on demand
- **Consumption Plan**: Pay per execution, scales to zero
- **Premium Plan**: For consistent performance, reserved instances

### Vercel

- **Automatic Scaling**: Vercel handles traffic spikes automatically
- **Edge Network**: Global CDN for fast delivery
- **Serverless Functions**: Auto-scales API routes

### Supabase

- **Database Scaling**: Upgrade tier as needed
- **Connection Pooling**: Configured automatically
- **Rate Limiting**: Built-in protection

## Support

For deployment issues:

1. Check this guide first
2. Review service-specific logs (Azure, Vercel, Supabase)
3. Verify all environment variables
4. Check service status pages
5. Review GitHub issues

---

**Last Updated**: December 2024
**Maintained by**: Humana AI Team

