"use client";

import { useRouter } from "next/navigation";
import { UploadZone } from "@/components/upload/UploadZone";
import { DocumentList } from "@/components/documents/DocumentList";
import { useDocuments } from "@/hooks/useDocuments";

export default function DocumentsLibraryPage() {
  const router = useRouter();
  const { documents, isLoading, error, refetch, deleteDocument } = useDocuments();

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">My Documents</h1>
        <p className="text-sm text-muted-foreground">
          Upload a file, then open it to ask grounded questions.
        </p>
      </div>

      <UploadZone
        onSuccess={async (documentId) => {
          await refetch();
          router.push(`/documents/${documentId}`);
        }}
      />

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <DocumentList
        documents={documents}
        isLoading={isLoading}
        onDelete={deleteDocument}
      />
    </div>
  );
}
