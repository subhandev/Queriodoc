export type SampleChunkPayload = {
  content: string;
  chunk_index: number;
  embedding: number[];
};

export type SampleDocumentPayload = {
  name: string;
  fileType: "txt";
  chunks: SampleChunkPayload[];
};
