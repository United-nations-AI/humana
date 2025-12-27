# Humana AI Avatar

Enterprise-grade multilingual AI avatar chatbot for human rights. Built with Next.js, Azure Functions, OpenAI, and Supabase.

## 🎯 Overview

Humana AI Avatar is a comprehensive AI-powered assistant designed to provide information and guidance related to human rights. The application supports multiple languages, voice interactions, and provides a seamless chat experience with an animated avatar.

## ✨ Features

- ✅ **AI-Powered Chat** - OpenAI GPT-4o-mini for intelligent conversations
- ✅ **Voice Input** - OpenAI Whisper for speech-to-text transcription
- ✅ **Voice Output** - OpenAI TTS for natural voice responses
- ✅ **Multilingual Support** - 10+ languages including English, Spanish, French, Arabic, Russian, Italian, Malayalam, Hindi, Swahili
- ✅ **Supabase Authentication** - Secure user authentication with email/password and magic links
- ✅ **Modern UI** - Beautiful, responsive interface with animated avatar
- ✅ **Terms & Conditions** - Built-in terms acceptance flow
- ✅ **Enterprise Security** - JWT authentication, secure headers, CORS protection

## 🏗️ Architecture

### Frontend (`apps/web`)
- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **3D Avatar**: Image-based with lip-sync animation
- **i18n**: Multi-language support with react-i18next

### Backend (`apps/api`)
- **Runtime**: Azure Functions (serverless)
- **Local Dev**: Express server
- **Language**: TypeScript
- **Authentication**: Supabase JWT verification
- **AI Services**: OpenAI API (GPT-4o-mini, Whisper, TTS)

### Infrastructure
- **Database**: Supabase (authentication and user data)
- **Deployment**: 
  - Web: Vercel or similar
  - API: Azure Functions
- **Containerization**: Docker & Docker Compose

## 🚀 Quick Start

### Prerequisites

- Node.js 20+
- Docker & Docker Compose (for containerized setup)
- OpenAI API key
- Supabase project

### Local Development with Docker

1. **Clone the repository**
```bash
   git clone https://github.com/Mr-Infect/humana-AI-v2.git
   cd humana-AI-v2
   ```

2. **Set up environment variables**
   
   Create a `.env` file in the root directory:
```bash
   # OpenAI API (required for chat, STT, and TTS)
   OPENAI_API_KEY=sk-your-openai-api-key

   # Supabase Configuration (required for authentication)
   SUPABASE_URL=https://your-project.supabase.co
   SUPABASE_SERVICE_ROLE_KEY=your_service_role_key

   # Web Configuration
WEB_ORIGIN=http://localhost:5000
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key
   ```

3. **Start services**
   ```bash
   docker-compose up -d
   ```

4. **Access the application**
   - Web App: http://localhost:5000
   - API Health: http://localhost:4000/health
   - Login: http://localhost:5000/login

### Local Development without Docker

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

## 📋 Environment Variables

### Required Variables

| Variable | Description | Where to Get It |
|----------|-------------|-----------------|
| `OPENAI_API_KEY` | OpenAI API key for chat, STT, TTS | [OpenAI Platform](https://platform.openai.com/api-keys) |
| `SUPABASE_URL` | Your Supabase project URL | Supabase Dashboard → Settings → API |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service role key (server-side only) | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_URL` | Same as SUPABASE_URL (for client-side) | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase anonymous/public key | Supabase Dashboard → Settings → API |
| `NEXT_PUBLIC_API_BASE_URL` | API base URL (e.g., http://localhost:4000) | - |
| `WEB_ORIGIN` | Web app origin for CORS (e.g., http://localhost:5000) | - |

### Getting Supabase Credentials

1. Go to [Supabase Dashboard](https://app.supabase.com)
2. Select your project
3. Navigate to **Settings** → **API**
4. Copy:
   - **Project URL** → use for `SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_URL`
   - **anon public** key → use for `NEXT_PUBLIC_SUPABASE_ANON_KEY`
   - **service_role** key → use for `SUPABASE_SERVICE_ROLE_KEY` (keep secret!)

### Supabase Configuration

1. **Enable Email Authentication**
   - Go to Authentication → Providers → Email
   - Enable "Email" provider
   - Enable "Magic Link" option

2. **Configure URL Settings**
   - Go to Authentication → URL Configuration
   - Set **Site URL**: `http://localhost:5000` (for local dev)
   - Add **Redirect URLs**: `http://localhost:5000/chat`

3. **Email Templates (Optional)**
   - Customize email templates in Authentication → Email Templates
   - Configure verification and magic link emails

## 🔐 Security

### Implemented Security Features

- ✅ JWT authentication (Supabase)
- ✅ Input validation (Zod schemas)
- ✅ Secure headers (CSP, HSTS, etc.)
- ✅ CORS restriction (WEB_ORIGIN only)
- ✅ Non-root container execution
- ✅ Environment variable validation
- ✅ Service role key protection (server-side only)

### Best Practices

- ⚠️ Never commit `.env` files or API keys to Git
- ⚠️ Use different keys for development and production
- ⚠️ Rotate API keys regularly
- ⚠️ Use Azure Key Vault or similar for production secrets
- ⚠️ Enable Application Insights for monitoring
- ⚠️ Configure WAF (Web Application Firewall) in production

## 📁 Project Structure

```
humana-AI-v2/
├── apps/
│   ├── web/                    # Next.js frontend
│   │   ├── app/               # App router pages
│   │   │   ├── page.tsx       # Landing page
│   │   │   ├── login/         # Login with Terms checkbox
│   │   │   ├── chat/          # Chat interface
│   │   │   ├── about/         # About page
│   │   │   └── terms/         # Terms and Conditions
│   │   ├── components/        # React components
│   │   │   ├── AvatarCanvas.tsx
│   │   │   └── LanguageSwitcher.tsx
│   │   ├── lib/               # Utilities
│   │   │   └── supabaseClient.ts
│   │   └── public/            # Static assets
│   │       └── humana-avatar.png
│   │
│   └── api/                   # Azure Functions API
│       ├── src/
│       │   ├── index.ts       # Azure Functions definitions
│       │   ├── local-dev.ts   # Express server for local dev
│       │   ├── auth.ts        # JWT verification
│       │   └── handlers/      # Request handlers
│       │       ├── chat.ts    # OpenAI chat
│       │       ├── stt.ts     # Whisper STT
│       │       └── tts.ts     # OpenAI TTS
│       ├── host.json          # Azure Functions config
│       └── local.settings.json.example
│
├── docker-compose.yml         # Docker Compose configuration
├── .gitignore                 # Git ignore rules
├── .dockerignore             # Docker ignore rules
└── README.md                 # This file
```

## 🛠️ API Endpoints

### Public
- `GET /health` - Health check

### Authenticated (Requires Supabase JWT Bearer Token)
- `POST /v1/chat` - Chat with AI
  ```json
  {
    "messages": [{"role": "user", "content": "Hello"}],
    "language": "en"
  }
  ```

- `POST /v1/stt` - Speech-to-text (Whisper)
  ```json
  {
    "audio": "base64_encoded_audio_data"
  }
  ```

- `POST /v1/tts` - Text-to-speech
  ```json
  {
    "text": "Hello, world",
    "language": "en"
  }
  ```

## 👤 User Onboarding

### For New Users

**Option 1: Magic Link (Recommended)**
1. Go to login page
2. Enter your email address
3. Accept Terms and Conditions
4. Click "Sign in with Magic Link"
5. Check your email and click the magic link
6. Account is automatically created and you're redirected to chat

**Option 2: Sign Up**
1. Go to login page
2. Click "Sign Up"
3. Enter email and password (minimum 6 characters)
4. Accept Terms and Conditions
5. Click "Create Account"
6. Verify your email
7. Return to login and sign in

### For Existing Users

1. Go to login page
2. Enter email and password
3. Accept Terms and Conditions
4. Click "Sign In"

## 🐛 Troubleshooting

### API returns "openai_not_configured"
- Check `OPENAI_API_KEY` is set in `.env` (local) or Azure Functions settings (production)

### Authentication errors
- Verify Supabase credentials are correct
- Check `SUPABASE_SERVICE_ROLE_KEY` matches Supabase project settings
- Ensure JWT token is included in `Authorization: Bearer <token>` header

### "Supabase not configured" error
- Verify all Supabase environment variables are set
- For Next.js: Ensure `NEXT_PUBLIC_*` variables are available at build time
- Rebuild Docker containers: `docker-compose build --no-cache web`

### Local dev server not starting
- Check port 4000 (API) and 5000 (Web) are not in use: `lsof -i :4000` or `lsof -i :5000`
- Verify dependencies installed: `npm install`
- Check Docker containers: `docker-compose ps`

### Language switching not working
- Hard refresh browser (Cmd+Shift+R or Ctrl+Shift+R)
- Clear browser cache
- Check browser console for errors

### Avatar not loading
- Ensure `humana-avatar.png` is in `apps/web/public/` directory
- Check image format (PNG recommended)
- Verify file permissions

## 📚 Documentation

- **Deployment Guide**: See `DEPLOYMENT_GUIDE.md` for detailed deployment instructions
- **API Documentation**: Check inline code comments in `apps/api/src/handlers/`

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

Private - All rights reserved

## 🔗 Links

- **Repository**: https://github.com/Mr-Infect/humana-AI-v2
- **OpenAI**: https://platform.openai.com
- **Supabase**: https://supabase.com
- **Next.js**: https://nextjs.org
- **Azure Functions**: https://azure.microsoft.com/services/functions

## 📞 Support

For issues or questions:
1. Check this README and DEPLOYMENT_GUIDE.md
2. Review Docker logs: `docker-compose logs`
3. Check browser console for frontend errors
4. Verify all environment variables are set correctly

---

**Built with ❤️ for human rights advocacy**
