"use client";

import { useRouter } from "next/navigation";
import { Search } from "lucide-react";
import { useState } from "react";
import { UploadZone } from "@/components/upload/UploadZone";
import { DocumentList } from "@/components/documents/DocumentList";
import { useDocuments } from "@/hooks/useDocuments";
import { authInputClass } from "@/components/auth/AuthShell";

export default function DocumentsLibraryPage() {
  const router = useRouter();
  const { documents, isLoading, error, refetch, deleteDocument } = useDocuments();
  const [query, setQuery] = useState("");

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight text-foreground">
            My Documents
          </h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            All your uploaded documents in one place.
          </p>
        </div>
        <div className="relative w-full sm:w-[280px]">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search documents..."
            className={`${authInputClass()} h-10 pl-9 text-[14px]`}
          />
        </div>
      </div>

      <div className="mt-8">
        <UploadZone
          onSuccess={async (documentId) => {
            await refetch();
            router.push(`/documents/${documentId}`);
          }}
        />
      </div>

      {error ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {error}
        </p>
      ) : null}

      <div className="mt-8">
        <DocumentList
          documents={documents}
          isLoading={isLoading}
          query={query}
          onDelete={deleteDocument}
        />
      </div>
    </>
  );
}
