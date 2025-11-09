# Humana AI Avatar

Enterprise-grade multilingual AI avatar chatbot for human rights. Serverless architecture (Azure Functions) with RAG pipeline for legal document retrieval. Web-first (Next.js), production-ready with cost-optimized Mistral API and OpenAI Whisper for high-quality voice.

## Architecture

- **apps/web**: Next.js 14 app router UI with 3D avatar (React Three Fiber)
- **apps/api**: Azure Functions serverless API (local dev with Express)
  - Chat: Mistral API (cost-optimized, pay-as-you-scale)
  - STT: OpenAI Whisper (high-quality voice transcription)
  - TTS: OpenAI TTS (natural voice output)
  - RAG: Vector search over legal documents (pgvector + Mistral embeddings)
- **Database**: PostgreSQL with pgvector extension (Supabase or managed Postgres)

## Quick Start

### Local Development

```bash
# Install dependencies
npm i

# Start API (port 4000) - local Express server
npm run dev -w apps/api

# In another terminal, start Web (port 5000)
npm run dev -w apps/web
```

### Verify Setup

```bash
# API health check
curl http://localhost:4000/health
# => {"ok":true}

# Chat API test (requires MISTRAL_API_KEY)
curl -X POST http://localhost:4000/v1/chat \
  -H 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"Hello"}]}'
```

## Environment Configuration

Create `.env` at repo root (do NOT commit secrets):

```bash
# Mistral API (for chat and embeddings)
MISTRAL_API_KEY=your_mistral_api_key

# OpenAI API (for Whisper STT and TTS only)
OPENAI_API_KEY=sk-...

# Web configuration
WEB_ORIGIN=http://localhost:5000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Database (PostgreSQL with pgvector)
DATABASE_URL=postgres://user:pass@host:5432/dbname

# Supabase (optional, for auth)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
```

### How to Obtain Credentials

#### Mistral API Key
1. Sign up at [https://console.mistral.ai](https://console.mistral.ai)
2. Navigate to API Keys
3. Create a new API key
4. Copy to `MISTRAL_API_KEY` in `.env`

**Cost**: Pay-as-you-scale model. No upfront costs. Scales with usage.

#### OpenAI API Key (for Whisper only)
1. Create account at [https://platform.openai.com](https://platform.openai.com)
2. Go to API Keys section
3. Create new secret key
4. Copy to `OPENAI_API_KEY` in `.env`

**Note**: Only used for Whisper STT and TTS. Chat uses Mistral for cost optimization.

#### Supabase Setup
1. Create project at [https://supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy `JWT Secret` → `SUPABASE_JWT_SECRET` (for API auth)

#### Database Setup (PostgreSQL + pgvector)

**Option A: Supabase (Recommended)**
1. In Supabase dashboard, go to SQL Editor
2. Run `apps/api/sql/init-rag.sql` to create RAG tables
3. Copy connection string from Project Settings → Database
4. Set as `DATABASE_URL`

**Option B: Managed Postgres (Azure, AWS RDS, etc.)**
1. Create PostgreSQL database
2. Install pgvector extension: `CREATE EXTENSION vector;`
3. Run `apps/api/sql/init-rag.sql` to create tables
4. Set connection string as `DATABASE_URL`

## RAG Pipeline (Legal Document Retrieval)

The RAG (Retrieval-Augmented Generation) pipeline allows the AI to answer questions using legal documents stored in the database.

### Architecture
- **Vector Database**: PostgreSQL with pgvector extension
- **Embeddings**: Mistral embeddings API (`mistral-embed`)
- **Retrieval**: Cosine similarity search over document embeddings
- **Integration**: Automatically retrieves relevant context for chat responses

### Admin Endpoint: Upload Documents

**Endpoint**: `POST /v1/admin/rag-upload`

**Authentication**: Requires Supabase JWT with `admin` role

**Request**:
```json
{
  "content": "Document text content...",
  "metadata": {
    "id": "doc-001",
    "title": "Human Rights Declaration",
    "source": "UN",
    "category": "legal"
  }
}
```

**Response**:
```json
{
  "success": true,
  "message": "Document stored"
}
```

### How It Works
1. Admin uploads document via `/v1/admin/rag-upload`
2. System generates embedding using Mistral embeddings API
3. Document + embedding stored in `legal_documents` table
4. When user asks a question:
   - Query is embedded using Mistral
   - Vector similarity search finds top 3 relevant documents
   - Context is injected into Mistral chat prompt
   - AI responds with accurate, source-backed answers

### Database Schema

See `apps/api/sql/init-rag.sql` for full schema. Key tables:
- `legal_documents`: Stores document content, metadata, and embeddings
- Vector index: `legal_documents_embedding_idx` for fast similarity search

## Deployment

### Web App (Vercel)

1. **Import Repository**
   - Go to [Vercel](https://vercel.com)
   - Import your repository
   - Select `apps/web` as root directory

2. **Environment Variables**
   - `NEXT_PUBLIC_API_BASE_URL`: Your Azure Functions API URL
   - `NEXT_PUBLIC_SUPABASE_URL`: Supabase project URL
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`: Supabase anon key

3. **Custom Domain**
   - Add your domain in Vercel → Domains
   - Configure DNS as instructed

4. **Deploy**
   - Push to main branch triggers auto-deploy
   - Or deploy manually from Vercel dashboard

### API (Azure Functions - Serverless)

#### Prerequisites
- Azure account with Functions App created
- Azure Functions Core Tools installed: `npm i -g azure-functions-core-tools`

#### Deployment Steps

1. **Configure Azure Functions**
   ```bash
   cd apps/api
   az login
   az functionapp create --resource-group <resource-group> --consumption-plan-location <region> --runtime node --runtime-version 20 --functions-version 4 --name <function-app-name> --storage-account <storage-account>
   ```

2. **Set Environment Variables in Azure**
   ```bash
   az functionapp config appsettings set --name <function-app-name> --resource-group <resource-group> --settings \
     MISTRAL_API_KEY="your_key" \
     OPENAI_API_KEY="your_key" \
     DATABASE_URL="your_connection_string" \
     SUPABASE_JWT_SECRET="your_secret" \
     WEB_ORIGIN="https://your-domain.com"
   ```

3. **Deploy Functions**
   ```bash
   cd apps/api
   npm run build
   func azure functionapp publish <function-app-name>
   ```

4. **Verify Deployment**
   - Visit: `https://<function-app-name>.azurewebsites.net/api/health`
   - Should return: `{"ok":true}`

#### Azure Functions Structure
- `src/index.ts`: Function definitions (Azure Functions)
- `src/handlers/`: Individual handler functions
- `src/lib/`: Shared utilities (Mistral, RAG, auth)
- `host.json`: Azure Functions configuration
- `local.settings.json`: Local development settings (not committed)

#### Local Development vs Production
- **Local**: Uses Express server (`src/local-dev.ts`) for faster iteration
- **Production**: Uses Azure Functions (`src/index.ts`) for serverless deployment
- Both use the same handler functions for consistency

### Database (Supabase or Managed Postgres)

#### Supabase (Recommended for Start)
1. Create Supabase project
2. Run `apps/api/sql/init-rag.sql` in SQL Editor
3. Use connection string from Project Settings

#### Azure Database for PostgreSQL
1. Create PostgreSQL server in Azure
2. Enable pgvector extension
3. Run `apps/api/sql/init-rag.sql`
4. Configure firewall rules
5. Use connection string as `DATABASE_URL`

## Cost Optimization

### Mistral API (Chat & Embeddings)
- **Model**: `mistral-small-latest` (cost-effective)
- **Pricing**: Pay-as-you-scale
- **Benefits**: No upfront costs, scales automatically

### OpenAI (Whisper & TTS only)
- **Whisper**: High-quality STT (kept for quality)
- **TTS**: Natural voice output
- **Usage**: Only for voice features, not chat

### Serverless Architecture
- **Azure Functions**: Pay per execution
- **No idle costs**: Functions scale to zero
- **Auto-scaling**: Handles traffic spikes automatically

## Security

### Implemented
- ✅ JWT authentication (Supabase)
- ✅ Rate limiting (per user/IP)
- ✅ CORS restriction (WEB_ORIGIN only)
- ✅ Input validation (Zod schemas)
- ✅ Secure headers (CSP, HSTS, etc.)
- ✅ Non-root container execution
- ✅ Environment variable validation

### Best Practices
- Rotate API keys regularly
- Use Azure Key Vault for secrets in production
- Enable Application Insights for monitoring
- Configure WAF (Web Application Firewall) in front
- Regular security audits

## Monitoring & Scaling

### Azure Application Insights
- Automatically enabled in Azure Functions
- Monitor function execution times
- Track errors and performance
- Set up alerts for anomalies

### Scaling
- **Automatic**: Azure Functions scale automatically
- **Concurrency**: Configured in `host.json`
- **Database**: Use connection pooling (already configured)
- **CDN**: Use Azure Front Door or Cloudflare for static assets

## API Endpoints

### Public
- `GET /health` - Health check

### Authenticated (Requires Supabase JWT)
- `POST /v1/chat` - Chat with AI (Mistral + RAG)
- `POST /v1/stt` - Speech-to-text (OpenAI Whisper)
- `POST /v1/tts` - Text-to-speech (OpenAI TTS)

### Admin Only (Requires admin role in JWT)
- `POST /v1/admin/rag-upload` - Upload legal documents to RAG pipeline

## Code Structure

```
apps/
├── web/                    # Next.js frontend
│   ├── app/               # App router pages
│   ├── components/        # React components
│   ├── lib/               # Utilities (Supabase client)
│   └── i18n.ts            # Internationalization
│
└── api/                   # Azure Functions API
    ├── src/
    │   ├── index.ts       # Azure Functions definitions
    │   ├── local-dev.ts   # Express server for local dev
    │   ├── handlers/      # Request handlers
    │   │   ├── chat.ts
    │   │   ├── stt.ts
    │   │   ├── tts.ts
    │   │   └── admin-rag-upload.ts
    │   └── lib/           # Shared libraries
    │       ├── mistral.ts # Mistral API client
    │       ├── rag.ts     # RAG pipeline
    │       └── auth.ts    # JWT verification
    └── sql/
        └── init-rag.sql   # Database schema
```

## Troubleshooting

### API returns "mistral_not_configured"
- Check `MISTRAL_API_KEY` is set in `.env` (local) or Azure Functions settings (production)

### RAG not working
- Verify `DATABASE_URL` is correct
- Check pgvector extension is installed: `CREATE EXTENSION vector;`
- Verify tables exist: Run `apps/api/sql/init-rag.sql`

### Authentication errors
- Check `SUPABASE_JWT_SECRET` matches Supabase project settings
- Verify JWT token includes required claims (role for admin endpoints)

### Local dev server not starting
- Check port 4000 is not in use: `lsof -i :4000`
- Verify dependencies installed: `npm i -w apps/api`

## Roadmap

- [ ] Streaming responses for faster perceived latency
- [ ] Multi-language RAG documents
- [ ] Admin dashboard for document management
- [ ] Analytics and usage tracking
- [ ] Advanced content moderation
- [ ] Mobile app (React Native wrapper)

## License

Private - All rights reserved
