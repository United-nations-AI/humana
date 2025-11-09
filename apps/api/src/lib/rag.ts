import { Pool } from 'pg';
import { getEmbedding } from './mistral';

let dbPool: Pool | null = null;

function getDbPool(): Pool {
  if (dbPool) return dbPool;
  const databaseUrl = process.env.DATABASE_URL;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL not configured');
  }
  dbPool = new Pool({ 
    connectionString: databaseUrl,
    max: 5,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 5000,
  });
  return dbPool;
}

export async function retrieveRagContext(query: string, limit = 3): Promise<string | null> {
  try {
    const pool = getDbPool();
    const queryEmbedding = await getEmbedding(query);
    if (!queryEmbedding) return null;

    const result = await pool.query(
      `SELECT content, metadata
       FROM legal_documents
       WHERE embedding IS NOT NULL
       ORDER BY embedding <=> $1::vector
       LIMIT $2`,
      [JSON.stringify(queryEmbedding), limit]
    );

    if (result.rows.length === 0) return null;

    return result.rows
      .map((row) => `[${row.metadata?.title || 'Document'}]: ${row.content}`)
      .join('\n\n');
  } catch (err) {
    console.error('RAG retrieval error:', err);
    return null;
  }
}

export async function storeDocument(
  content: string,
  metadata: Record<string, any>,
  embedding: number[]
): Promise<void> {
  const pool = getDbPool();
  await pool.query(
    `INSERT INTO legal_documents (content, metadata, embedding, created_at)
     VALUES ($1, $2, $3::vector, NOW())
     ON CONFLICT ((metadata->>'id')) DO UPDATE
     SET content = $1, metadata = $2, embedding = $3::vector, updated_at = NOW()`,
    [content, JSON.stringify(metadata), JSON.stringify(embedding)]
  );
}
