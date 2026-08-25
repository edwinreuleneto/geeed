// React
import { Suspense } from "react";

// Components
import AuthGuard from "@/components/AuthGuard";
import FullViewer from "./_components/full-viewer";

interface PageProps {
  params: Promise<{ docId: string }>;
}

export default async function DocViewerPage({ params }: PageProps) {
  const { docId } = await params;
  return (
    <AuthGuard>
      <Suspense fallback={null}>
        <FullViewer docId={docId} />
      </Suspense>
    </AuthGuard>
  );
}
