// Components
import DocumentDetail from "./_components/document-detail";

interface PageProps {
  params: Promise<{ docId: string }>;
}

export default async function DocumentoPage({ params }: PageProps) {
  const { docId } = await params;
  return <DocumentDetail docId={docId} />;
}
