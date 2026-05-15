import type { UIMessage } from "ai";

export type FileType = "pdf" | "docx" | "txt";

export type DocumentStatus = "processing" | "ready" | "error";

export type MessageRole = "user" | "assistant";

export type ApiError = { error: string };

export type DocumentRow = {
  id: string;
  user_id: string;
  name: string;
  file_path: string;
  file_type: FileType;
  status: DocumentStatus;
  chunk_count: number | null;
  is_sample?: boolean;
  message_count?: number;
  created_at: string;
};

export type MessageRow = {
  id: string;
  document_id: string;
  user_id: string;
  role: MessageRole;
  content: string;
  created_at: string;
};

export type MatchChunkRow = {
  content: string;
  chunk_index: number;
  similarity: number;
};

export type SourceChunkPreview = {
  chunk_index: number;
  content: string;
};

export type QueriodocUIMessage = UIMessage<
  { createdAt?: string },
  {
    sources: { chunks: SourceChunkPreview[] };
  }
>;
