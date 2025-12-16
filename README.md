# Humana AI Avatar

Enterprise-grade multilingual AI avatar chatbot for human rights. Serverless architecture (Azure Functions) with OpenAI integration for chat, speech-to-text, and text-to-speech. Web-first (Next.js), production-ready.

## Architecture

- **apps/web**: Next.js 14 app router UI with 3D avatar (React Three Fiber)
- **apps/api**: Azure Functions serverless API (local dev with Express)
  - Chat: OpenAI GPT-4o-mini (cost-optimized)
  - STT: OpenAI Whisper (high-quality voice transcription)
  - TTS: OpenAI TTS (natural voice output)
- **Database**: Supabase for authentication and user data

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

# Chat API test (requires OPENAI_API_KEY)
curl -X POST http://localhost:4000/v1/chat \
  -H 'Content-Type: application/json' \
  --data '{"messages":[{"role":"user","content":"Hello"}]}'
```

## Environment Configuration

Create `.env` at repo root (do NOT commit secrets):

```bash
# OpenAI API (for chat, STT, and TTS)
OPENAI_API_KEY=sk-...

# Web configuration
WEB_ORIGIN=http://localhost:5000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000

# Supabase (for authentication)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
SUPABASE_JWT_SECRET=your_jwt_secret
```

### How to Obtain Credentials

#### OpenAI API Key
1. Create account at [https://platform.openai.com](https://platform.openai.com)
2. Go to API Keys section
3. Create new secret key
4. Copy to `OPENAI_API_KEY` in `.env`

**Usage**: Used for chat (GPT-4o-mini), Whisper STT, and TTS.

#### Supabase Setup
1. Create project at [https://supabase.com](https://supabase.com)
2. Go to Project Settings → API
3. Copy `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
4. Copy `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`
5. Copy `JWT Secret` → `SUPABASE_JWT_SECRET` (for API auth)

#### Enable Email Login (Supabase)
1. In Supabase dashboard, Authentication → Providers → Email: enable email+password and Magic Link
2. Authentication → URL Configuration: set Site URL to your domain (e.g., `http://localhost:5000` for local)
3. Optional: Customize email templates for verification and magic links

## User Flow

1. **Landing Page** (`/`): Users see the Humana branding and click "Login"
2. **Login Page** (`/login`): Users enter email/password, accept Terms and Conditions, then login
3. **Chat Page** (`/chat`): After successful login, users interact with the AI avatar via text or voice

## Features

- ✅ OpenAI-powered chat (GPT-4o-mini)
- ✅ Voice input (OpenAI Whisper)
- ✅ Voice output (OpenAI TTS)
- ✅ Multilingual support (10+ languages)
- ✅ Supabase authentication
- ✅ Terms and Conditions acceptance
- ✅ Enterprise-grade security
- ✅ Serverless architecture (Azure Functions)

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
     OPENAI_API_KEY="your_key" \
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

## Security

### Implemented
- ✅ JWT authentication (Supabase)
- ✅ Input validation (Zod schemas)
- ✅ Secure headers (CSP, HSTS, etc.)
- ✅ CORS restriction (WEB_ORIGIN only)
- ✅ Non-root container execution
- ✅ Environment variable validation

### Best Practices
- Rotate API keys regularly
- Use Azure Key Vault for secrets in production
- Enable Application Insights for monitoring
- Configure WAF (Web Application Firewall) in front
- Regular security audits

## API Endpoints

### Public
- `GET /health` - Health check

### Authenticated (Requires Supabase JWT)
- `POST /v1/chat` - Chat with AI (OpenAI GPT-4o-mini)
- `POST /v1/stt` - Speech-to-text (OpenAI Whisper)
- `POST /v1/tts` - Text-to-speech (OpenAI TTS)

## Code Structure

```
apps/
├── web/                    # Next.js frontend
│   ├── app/               # App router pages
│   │   ├── page.tsx       # Landing page
│   │   ├── login/         # Login with Terms checkbox
│   │   ├── chat/          # Chat interface
│   │   ├── about/         # About page
│   │   └── terms/         # Terms and Conditions
│   ├── components/        # React components
│   └── lib/               # Utilities (Supabase client)
│
└── api/                   # Azure Functions API
    ├── src/
    │   ├── index.ts       # Azure Functions definitions
    │   ├── local-dev.ts   # Express server for local dev
    │   ├── handlers/      # Request handlers
    │   │   ├── chat.ts    # OpenAI chat
    │   │   ├── stt.ts     # Whisper STT
    │   │   └── tts.ts     # OpenAI TTS
    │   └── lib/           # Shared libraries
    │       └── auth.ts    # JWT verification
    └── host.json          # Azure Functions config
```

## Troubleshooting

### API returns "openai_not_configured"
- Check `OPENAI_API_KEY` is set in `.env` (local) or Azure Functions settings (production)

### Authentication errors
- Check `SUPABASE_JWT_SECRET` matches Supabase project settings
- Verify JWT token includes required claims

### Local dev server not starting
- Check port 4000 is not in use: `lsof -i :4000`
- Verify dependencies installed: `npm i -w apps/api`

### Avatar not loading
- The chat page uses a placeholder GLB model. Replace the URL in `AvatarCanvas.tsx` with your actual avatar file.

## License

Private - All rights reserved
