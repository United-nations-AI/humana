// Local development server (Express) for testing before Azure Functions deployment
import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import multer from 'multer';
import { healthHandler } from './handlers/health';
import { chatHandler } from './handlers/chat';
import { sttHandler } from './handlers/stt';
import { ttsHandler } from './handlers/tts';
import { verifySupabaseJwt } from './auth';

// Load .env from project root
// When running from apps/api, go up two levels to project root (apps/api -> apps -> root)
const projectRoot = path.resolve(process.cwd(), '../..');
const envPath = path.join(projectRoot, '.env');
dotenv.config({ path: envPath });
console.log('Loading .env from:', envPath);

const app = express();
app.use(cors({ origin: process.env.WEB_ORIGIN || '*' }));
app.use(express.json({ limit: '10mb' }));

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 25 * 1024 * 1024 } });

// Convert Azure Functions HttpRequest to Express Request
function createHttpRequest(req: Request, file?: Express.Multer.File): any {
  return {
    json: async () => req.body,
    formData: async () => {
      const formData = new Map();
      if (file) {
        formData.set('audio', file as any);
      }
      return formData;
    },
    headers: {
      get: (name: string) => req.headers[name.toLowerCase()],
    },
  } as any;
}

function createContext(): any {
  return {
    error: (...args: any[]) => console.error(...args),
    log: (...args: any[]) => console.log(...args),
  };
}

async function handleAuth(req: Request): Promise<{ status: number; json: any } | null> {
  const authResult = await verifySupabaseJwt(createHttpRequest(req));
  if (authResult) {
    return { status: authResult.status || 401, json: authResult.jsonBody };
  }
  return null;
}

app.get('/health', async (_req: Request, res: Response) => {
  const result = await healthHandler(createHttpRequest(_req), createContext());
  res.status(result.status || 200).json(result.jsonBody || result.body);
});

app.post('/v1/chat', async (req: Request, res: Response) => {
  const authError = await handleAuth(req);
  if (authError) {
    return res.status(authError.status).json(authError.json);
  }
  const result = await chatHandler(createHttpRequest(req), createContext());
  res.status(result.status || 200).json(result.jsonBody || result.body);
});

app.post('/v1/stt', upload.single('audio'), async (req: Request, res: Response) => {
  const authError = await handleAuth(req);
  if (authError) {
    return res.status(authError.status).json(authError.json);
  }
  const file = (req as any).file;
  const result = await sttHandler(createHttpRequest(req, file), createContext());
  res.status(result.status || 200).json(result.jsonBody || result.body);
});

app.post('/v1/tts', async (req: Request, res: Response) => {
  const authError = await handleAuth(req);
  if (authError) {
    return res.status(authError.status).json(authError.json);
  }
  const result = await ttsHandler(createHttpRequest(req), createContext());
  if (result.body) {
    res.status(result.status || 200).set(result.headers || {}).send(result.body);
  } else {
    res.status(result.status || 200).json(result.jsonBody);
  }
});

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`Local dev server listening on http://localhost:${port}`);
  console.log(`Health: http://localhost:${port}/health`);
  console.log(`Chat: http://localhost:${port}/v1/chat`);
});
