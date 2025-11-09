# Changes Summary - Serverless Migration & RAG Pipeline

## Major Changes

### 1. Serverless Architecture (Azure Functions)
- **Before**: Express server running in containers
- **After**: Azure Functions serverless API
- **Benefits**: 
  - Pay-per-execution pricing
  - Auto-scaling to zero (no idle costs)
  - Automatic scaling for traffic spikes
  - Reduced operational overhead

### 2. Mistral API Integration
- **Before**: OpenAI for all AI operations
- **After**: Mistral API for chat and embeddings, OpenAI only for Whisper STT and TTS
- **Benefits**:
  - Cost reduction (pay-as-you-scale model)
  - No upfront costs
  - Scales automatically with usage
  - High-quality results with Mistral models

### 3. RAG Pipeline (Retrieval-Augmented Generation)
- **New Feature**: Legal document retrieval system
- **Components**:
  - PostgreSQL with pgvector extension
  - Mistral embeddings for document vectors
  - Cosine similarity search
  - Automatic context injection in chat responses
- **Admin Endpoint**: `/v1/admin/rag-upload` for document management

### 4. Code Structure Improvements
- **Modular handlers**: Each endpoint in separate file
- **Shared libraries**: Reusable utilities (Mistral, RAG, auth)
- **Local dev server**: Express server for faster iteration
- **Production ready**: Azure Functions for deployment

### 5. Security Enhancements
- JWT authentication on all endpoints
- Admin role verification for RAG uploads
- Input validation with Zod schemas
- Secure headers (CSP, HSTS, etc.)
- Non-root container execution

### 6. Database Schema
- **New table**: `legal_documents`
  - Stores document content and metadata
  - Vector embeddings for similarity search
  - Unique index on document IDs for upserts
  - Automatic updated_at timestamps

## File Changes

### New Files
- `apps/api/src/index.ts` - Azure Functions definitions
- `apps/api/src/local-dev.ts` - Express server for local development
- `apps/api/src/handlers/chat.ts` - Chat handler with RAG integration
- `apps/api/src/handlers/stt.ts` - Speech-to-text handler
- `apps/api/src/handlers/tts.ts` - Text-to-speech handler
- `apps/api/src/handlers/admin-rag-upload.ts` - Admin RAG upload handler
- `apps/api/src/lib/mistral.ts` - Mistral API client
- `apps/api/src/lib/rag.ts` - RAG pipeline utilities
- `apps/api/sql/init-rag.sql` - Database schema for RAG
- `apps/api/host.json` - Azure Functions configuration
- `apps/api/local.settings.json.example` - Local dev settings template
- `DEPLOYMENT.md` - Detailed deployment guide
- `CHANGES.md` - This file

### Modified Files
- `apps/api/package.json` - Updated dependencies (Mistral, Azure Functions)
- `apps/api/src/auth.ts` - Updated for Azure Functions compatibility
- `apps/web/app/chat/page.tsx` - Fixed TypeScript type issues
- `README.md` - Complete rewrite with serverless and RAG documentation

### Removed Files
- Old Express server implementation (replaced with Azure Functions)

## Environment Variables

### New Variables
- `MISTRAL_API_KEY` - Mistral API key for chat and embeddings
- `DATABASE_URL` - PostgreSQL connection string (for RAG)

### Updated Variables
- `OPENAI_API_KEY` - Now only used for Whisper STT and TTS
- `SUPABASE_JWT_SECRET` - Required for API authentication

## API Endpoints

### Unchanged
- `GET /health` - Health check
- `POST /v1/chat` - Chat with AI (now uses Mistral + RAG)
- `POST /v1/stt` - Speech-to-text (still uses OpenAI Whisper)
- `POST /v1/tts` - Text-to-speech (still uses OpenAI TTS)

### New
- `POST /v1/admin/rag-upload` - Upload legal documents (admin only)

## Deployment Changes

### Before
- Docker Compose for local development
- Container deployment for production

### After
- Local Express server for development
- Azure Functions for production (serverless)
- Vercel for web deployment (unchanged)

## Migration Guide

### For Developers
1. Update `.env` with `MISTRAL_API_KEY` and `DATABASE_URL`
2. Run `apps/api/sql/init-rag.sql` in your database
3. Use `npm run dev -w apps/api` for local development
4. Deploy to Azure Functions for production

### For DevOps
1. Set up Azure Functions App
2. Configure environment variables in Azure
3. Deploy using `func azure functionapp publish`
4. Update web app's `NEXT_PUBLIC_API_BASE_URL` to Azure Functions URL

## Breaking Changes

### None
- All API endpoints remain the same
- Web app requires no changes
- Backward compatible with existing clients

## Performance Improvements

- **Reduced latency**: Serverless functions start faster than containers
- **Auto-scaling**: Handles traffic spikes automatically
- **Cost optimization**: Pay only for actual usage
- **RAG integration**: Faster, more accurate responses with document context

## Security Improvements

- **JWT authentication**: All endpoints require authentication
- **Admin role verification**: RAG uploads restricted to admins
- **Input validation**: Zod schemas for all inputs
- **Secure headers**: CSP, HSTS, and other security headers

## Next Steps

1. **Deploy to Azure Functions**: Follow `DEPLOYMENT.md`
2. **Set up RAG pipeline**: Upload legal documents via admin endpoint
3. **Monitor performance**: Use Azure Application Insights
4. **Scale as needed**: Azure Functions auto-scales

## Support

For issues or questions:
- Check `DEPLOYMENT.md` for deployment help
- Review `README.md` for setup instructions
- Check Azure Functions logs for errors
- Verify environment variables are set correctly

