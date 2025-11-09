-- Enable pgvector extension
CREATE EXTENSION IF NOT EXISTS vector;

-- Create legal_documents table for RAG
CREATE TABLE IF NOT EXISTS legal_documents (
  id SERIAL PRIMARY KEY,
  content TEXT NOT NULL,
  metadata JSONB NOT NULL,
  embedding vector(1024),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for vector similarity search
CREATE INDEX IF NOT EXISTS legal_documents_embedding_idx 
ON legal_documents 
USING ivfflat (embedding vector_cosine_ops)
WITH (lists = 100);

-- Create unique index on metadata->>'id' for upserts
CREATE UNIQUE INDEX IF NOT EXISTS legal_documents_metadata_id_idx 
ON legal_documents ((metadata->>'id'));

-- Create updated_at trigger
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_legal_documents_updated_at 
BEFORE UPDATE ON legal_documents 
FOR EACH ROW 
EXECUTE FUNCTION update_updated_at_column();

