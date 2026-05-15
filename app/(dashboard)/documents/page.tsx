"use client";

import { useRouter } from "next/navigation";
import { Loader2, Search } from "lucide-react";
import { useMemo, useState } from "react";
import { UploadZone } from "@/components/upload/UploadZone";
import { DocumentList } from "@/components/documents/DocumentList";
import { OnboardingBanner } from "@/components/onboarding/OnboardingBanner";
import { useDocuments } from "@/hooks/useDocuments";
import { useOnboardingSample } from "@/hooks/useOnboardingSample";
import { authInputClass } from "@/components/auth/AuthShell";
import { getDocumentsPageSubtitle, seedingCopy } from "@/lib/onboarding/copy";

export default function DocumentsLibraryPage() {
  const router = useRouter();
  const { documents, isLoading, error, refetch, deleteDocument } = useDocuments();
  const [query, setQuery] = useState("");

  const { seeding, seedError } = useOnboardingSample({
    documentsCount: documents.length,
    isLoading,
    onSeeded: refetch,
  });

  const sampleDocument = useMemo(
    () => documents.find((d) => d.is_sample),
    [documents],
  );
  const hasUserUploads = useMemo(
    () => documents.some((d) => !d.is_sample),
    [documents],
  );
  const showSampleBanner = Boolean(sampleDocument) && !hasUserUploads;
  const hasSampleOnly = showSampleBanner;

  const pageBusy = isLoading || seeding;

  return (
    <>
      <div className="flex flex-col gap-5 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="text-[22px] font-semibold leading-tight text-foreground">
            My Documents
          </h1>
          <p className="mt-1 text-[14px] text-muted-foreground">
            {getDocumentsPageSubtitle(hasSampleOnly)}
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

      {seeding ? (
        <div
          className="mt-6 flex items-center gap-3 rounded-xl border border-border bg-card px-4 py-3"
          role="status"
        >
          <Loader2 className="h-4 w-4 shrink-0 animate-spin text-primary" />
          <div>
            <p className="text-[14px] font-medium text-foreground">{seedingCopy.title}</p>
            <p className="text-[13px] text-muted-foreground">{seedingCopy.subtitle}</p>
          </div>
        </div>
      ) : null}

      {seedError ? (
        <p className="mt-4 text-sm text-destructive" role="alert">
          {seedError}
        </p>
      ) : null}

      {showSampleBanner && sampleDocument ? (
        <div className="mt-6">
          <OnboardingBanner sampleDocumentId={sampleDocument.id} />
        </div>
      ) : null}

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
          isLoading={pageBusy}
          query={query}
          onDelete={deleteDocument}
        />
      </div>
    </>
  );
}
