"use client";

// React
import { useState } from "react";

// Next
import Link from "next/link";

// Libs
import {
  BarChart3,
  ChevronRight,
  FileSignature,
  FolderOpen,
  Receipt,
  Ruler,
  ShieldCheck,
  Users,
  type LucideIcon,
} from "lucide-react";

// Components
import DocTypeIcon from "@/components/DocTypeIcon";
import StatusBadge from "@/components/StatusBadge";

// Services
import { useDocumentsQuery, useFoldersQuery } from "@/services/documents";

// Utils
import { cn } from "@/lib/utils";
import { buildFolderTree, rollupCount, type FolderNode } from "@/utils/approvals";

// Types
import type { GedDocument } from "@/types/ged";

const FOLDER_ICONS: Record<string, LucideIcon> = {
  FileSignature,
  Receipt,
  Users,
  BarChart3,
  Ruler,
  ShieldCheck,
};

export default function HierarchyTree() {
  const { data: folders = [] } = useFoldersQuery();
  const { data: documents = [] } = useDocumentsQuery({ sort: "name" });

  const tree = buildFolderTree(folders);

  const countByFolder: Record<string, number> = {};
  const docsByFolder: Record<string, GedDocument[]> = {};
  for (const doc of documents) {
    countByFolder[doc.folderId] = (countByFolder[doc.folderId] ?? 0) + 1;
    (docsByFolder[doc.folderId] ??= []).push(doc);
  }

  if (folders.length === 0) {
    return <div className="h-40 animate-pulse rounded-xl bg-black/5" />;
  }

  return (
    <div className="rounded-xl border border-hairline bg-surface-elevated p-2">
      <ul className="flex flex-col">
        {tree.map((node) => (
          <FolderRow
            key={node.id}
            node={node}
            depth={0}
            countByFolder={countByFolder}
            docsByFolder={docsByFolder}
          />
        ))}
      </ul>
    </div>
  );
}

function FolderRow({
  node,
  depth,
  countByFolder,
  docsByFolder,
}: {
  node: FolderNode;
  depth: number;
  countByFolder: Record<string, number>;
  docsByFolder: Record<string, GedDocument[]>;
}) {
  const [open, setOpen] = useState(depth === 0);
  const Icon = FOLDER_ICONS[node.icon] ?? FolderOpen;
  const total = rollupCount(node, countByFolder);
  const ownDocs = docsByFolder[node.id] ?? [];
  const hasChildren = node.children.length > 0 || ownDocs.length > 0;

  return (
    <li>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-2 rounded-lg py-1.5 pr-2 text-left transition-colors hover:bg-surface"
        style={{ paddingLeft: `${depth * 18 + 6}px` }}
      >
        <ChevronRight
          className={cn(
            "h-3.5 w-3.5 shrink-0 text-ink-faint transition-transform",
            open ? "rotate-90" : "",
            hasChildren ? "" : "opacity-0",
          )}
          aria-hidden="true"
        />
        <Icon className="h-[18px] w-[18px] shrink-0 text-brand-600" strokeWidth={2} aria-hidden="true" />
        <span className="min-w-0 flex-1 truncate text-[13.5px] font-medium text-ink">{node.name}</span>
        <span className="shrink-0 text-[11.5px] tabular-nums text-ink-faint">{total}</span>
      </button>

      {open ? (
        <div>
          {node.children.map((child) => (
            <ul key={child.id}>
              <FolderRow
                node={child}
                depth={depth + 1}
                countByFolder={countByFolder}
                docsByFolder={docsByFolder}
              />
            </ul>
          ))}

          {ownDocs.map((doc) => (
            <Link
              key={doc.id}
              href={`/documentos/${doc.id}`}
              className="flex items-center gap-2 rounded-lg py-1.5 pr-2 transition-colors hover:bg-surface"
              style={{ paddingLeft: `${(depth + 1) * 18 + 24}px` }}
            >
              <DocTypeIcon kind={doc.kind} size="sm" />
              <span className="min-w-0 flex-1 truncate text-[12.5px] text-ink-soft">{doc.name}</span>
              <StatusBadge status={doc.status} size="sm" />
            </Link>
          ))}
        </div>
      ) : null}
    </li>
  );
}
