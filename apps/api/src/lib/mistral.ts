let mistralClient: any = null;

export function getMistralClient(): any {
  if (mistralClient) return mistralClient;
  const apiKey = process.env.MISTRAL_API_KEY;
  if (!apiKey) return null;
  
  try {
    // Dynamic import for Mistral SDK
    const { Mistral } = require('@mistralai/mistralai');
    mistralClient = new Mistral({ apiKey });
    return mistralClient;
  } catch (err) {
    console.error('Failed to initialize Mistral client:', err);
    return null;
  }
}

export async function getEmbedding(text: string): Promise<number[] | null> {
  const client = getMistralClient();
  if (!client) return null;
  
  try {
    // Mistral embeddings API
    const response = await fetch('https://api.mistral.ai/v1/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: 'mistral-embed',
        input: text,
      }),
    });
    
    if (!response.ok) {
      throw new Error(`Mistral API error: ${response.statusText}`);
    }
    
    const data = await response.json() as any;
    return data.data?.[0]?.embedding || null;
  } catch (err) {
    console.error('Embedding error:', err);
    return null;
  }
}

export async function chatComplete(messages: Array<{ role: string; content: string }>, options?: any) {
  const client = getMistralClient();
  if (!client) throw new Error('Mistral client not configured');
  
  try {
    // Use Mistral chat API directly
    const response = await fetch('https://api.mistral.ai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.MISTRAL_API_KEY}`,
      },
      body: JSON.stringify({
        model: options?.model || 'mistral-small-latest',
        messages,
        temperature: options?.temperature || 0.3,
        max_tokens: options?.maxTokens || 1000,
      }),
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({})) as any;
      throw new Error(error.error?.message || `Mistral API error: ${response.statusText}`);
    }
    
    const data = await response.json() as any;
    return {
      choices: [{
        message: {
          content: data.choices?.[0]?.message?.content || '',
        },
      }],
    };
  } catch (err) {
    console.error('Chat complete error:', err);
    throw err;
  }
}
