# Deployment Guide - Humana AI Avatar

## Quick Deployment Checklist

### 1. Prerequisites
- [ ] Azure account with Functions App
- [ ] Vercel account (for web deployment)
- [ ] Supabase project (for auth + optional DB)
- [ ] PostgreSQL database with pgvector (Supabase or managed)
- [ ] Mistral API key
- [ ] OpenAI API key (for Whisper only)

### 2. Database Setup

#### Step 1: Create Database
- **Option A**: Use Supabase (easiest)
  - Create project at supabase.com
  - Go to SQL Editor
  - Run `apps/api/sql/init-rag.sql`

- **Option B**: Managed PostgreSQL
  - Create PostgreSQL server (Azure, AWS RDS, etc.)
  - Install pgvector: `CREATE EXTENSION vector;`
  - Run `apps/api/sql/init-rag.sql`

#### Step 2: Get Connection String
- Copy connection string from database provider
- Format: `postgres://user:pass@host:5432/dbname`
- Store securely (Azure Key Vault recommended)

### 3. API Deployment (Azure Functions)

#### Step 1: Create Azure Functions App
```bash
az login
az group create --name humana-rg --location eastus
az storage account create --name humanastorage --location eastus --resource-group humana-rg --sku Standard_LRS
az functionapp create \
  --resource-group humana-rg \
  --consumption-plan-location eastus \
  --runtime node \
  --runtime-version 20 \
  --functions-version 4 \
  --name humana-api \
  --storage-account humanastorage
```

#### Step 2: Configure Environment Variables
```bash
az functionapp config appsettings set \
  --name humana-api \
  --resource-group humana-rg \
  --settings \
    MISTRAL_API_KEY="your_mistral_key" \
    OPENAI_API_KEY="your_openai_key" \
    DATABASE_URL="postgres://..." \
    SUPABASE_JWT_SECRET="your_jwt_secret" \
    WEB_ORIGIN="https://your-domain.com" \
    NODE_ENV="production"
```

#### Step 3: Deploy Functions
```bash
cd apps/api
npm install
npm run build
func azure functionapp publish humana-api
```

#### Step 4: Verify Deployment
```bash
curl https://humana-api.azurewebsites.net/api/health
# Should return: {"ok":true}
```

### 4. Web Deployment (Vercel)

#### Step 1: Import Repository
1. Go to [vercel.com](https://vercel.com)
2. Click "Add New Project"
3. Import your repository
4. Set root directory to `apps/web`

#### Step 2: Configure Environment Variables
In Vercel project settings:
- `NEXT_PUBLIC_API_BASE_URL`: `https://humana-api.azurewebsites.net/api`
- `NEXT_PUBLIC_SUPABASE_URL`: Your Supabase URL
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Your Supabase anon key

#### Step 3: Deploy
- Push to main branch (auto-deploy)
- Or deploy manually from dashboard

#### Step 4: Configure Custom Domain
1. Go to Vercel → Domains
2. Add your custom domain
3. Configure DNS as instructed
4. Update `WEB_ORIGIN` in Azure Functions to match

### 5. Post-Deployment

#### Verify Endpoints
```bash
# Health check
curl https://humana-api.azurewebsites.net/api/health

# Chat (requires auth token)
curl -X POST https://humana-api.azurewebsites.net/api/v1/chat \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"messages":[{"role":"user","content":"Hello"}]}'
```

#### Upload Legal Documents (Admin)
```bash
curl -X POST https://humana-api.azurewebsites.net/api/v1/admin/rag-upload \
  -H "Authorization: Bearer ADMIN_JWT_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "content": "Legal document text...",
    "metadata": {
      "id": "doc-001",
      "title": "Human Rights Declaration",
      "source": "UN",
      "category": "legal"
    }
  }'
```

### 6. Monitoring

#### Azure Application Insights
- Automatically enabled in Azure Functions
- Monitor function execution times
- Track errors and performance
- Set up alerts

#### Vercel Analytics
- Enable in Vercel dashboard
- Track web app performance
- Monitor page loads and errors

### 7. Scaling

#### Automatic Scaling
- Azure Functions: Auto-scales based on demand
- Vercel: Auto-scales web traffic
- Database: Use connection pooling (configured)

#### Manual Scaling
- Azure Functions: Configure in Azure portal
- Database: Upgrade tier if needed
- CDN: Add Azure Front Door or Cloudflare

### 8. Security Checklist

- [ ] API keys stored in Azure Key Vault (production)
- [ ] CORS configured to only allow your domain
- [ ] JWT secrets rotated regularly
- [ ] Database firewall configured
- [ ] HTTPS enabled (automatic with Azure/Vercel)
- [ ] Security headers configured (already done)
- [ ] Rate limiting enabled (already done)

### 9. Cost Optimization

#### Azure Functions
- Consumption plan: Pay per execution
- No idle costs
- Auto-scales to zero

#### Mistral API
- Pay-as-you-scale model
- No upfront costs
- Scales with usage

#### Database
- Supabase: Free tier available
- Managed Postgres: Start with basic tier, scale as needed

### 10. Troubleshooting

#### API not responding
- Check Azure Functions logs in Azure portal
- Verify environment variables are set
- Check function app is running

#### RAG not working
- Verify database connection string
- Check pgvector extension is installed
- Verify tables exist (run init-rag.sql)

#### Authentication errors
- Verify JWT secret matches Supabase
- Check token expiration
- Verify user has required role (for admin endpoints)

## Support

For issues or questions:
1. Check logs in Azure Application Insights
2. Check Vercel deployment logs
3. Review error messages in browser console
4. Verify all environment variables are set correctly

