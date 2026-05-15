import type { Metadata } from "next";
import { MarketingNavbar } from "@/components/layout/MarketingNavbar";
import {
  Hero,
  ProofBar,
  Features,
  HowItWorks,
  CtaBanner,
  Footer,
} from "@/components/marketing/LandingSections";

export const metadata: Metadata = {
  title: "Queriodoc — Ask anything. From any document.",
  description:
    "Upload a PDF, Word doc, or text file and get instant, accurate answers grounded in your content. RAG-powered Q&A — no hallucinations.",
  openGraph: {
    title: "Queriodoc — Document Q&A powered by RAG",
    description:
      "Chat with any document. Grounded answers with sources, powered by RAG + GPT-4o.",
  },
};

export default function HomePage() {
  return (
    <div className="min-h-screen scroll-smooth bg-background text-foreground">
      <MarketingNavbar />
      <main>
        <Hero />
        <ProofBar />
        <Features />
        <HowItWorks />
        <CtaBanner />
      </main>
      <Footer />
    </div>
  );
}
