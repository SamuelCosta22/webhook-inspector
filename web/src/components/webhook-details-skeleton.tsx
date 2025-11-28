import { SectionTitle } from "./section-title";

function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`h-4 bg-zinc-800 rounded animate-pulse ${className}`} />
  );
}

function SkeletonBadge() {
  return <div className="h-6 w-16 bg-zinc-800 rounded animate-pulse" />;
}

function SkeletonTableRow() {
  return (
    <tr className="border-b border-zinc-700 last:border-0">
      <td className="p-3 bg-zinc-800/50 border-r border-zinc-700">
        <SkeletonLine className="w-24" />
      </td>
      <td className="p-3">
        <SkeletonLine className="w-32" />
      </td>
    </tr>
  );
}

function SkeletonTable({ rows = 4 }: { rows?: number }) {
  return (
    <div className="overflow-hidden rounded-lg border border-zinc-700">
      <table className="w-full">
        <tbody>
          {Array.from({ length: rows }).map((_, i) => (
            <SkeletonTableRow key={i} />
          ))}
        </tbody>
      </table>
    </div>
  );
}

function SkeletonCodeBlock() {
  return (
    <div className="relative rounded-lg border border-zinc-700 overflow-hidden">
      <div className="p-4 space-y-2">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="flex gap-2">
            <SkeletonLine className="w-4" />
            <SkeletonLine className={i % 2 === 0 ? "w-48" : "w-64"} />
          </div>
        ))}
      </div>
    </div>
  );
}

export function WebhookDetailsSkeleton() {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {/* Header Skeleton */}
      <div className="space-y-2 border-b border-zinc-700 p-4">
        <div className="flex items-center gap-3">
          <SkeletonBadge />
          <SkeletonLine className="w-48" />
        </div>
        <div className="flex items-center gap-2">
          <SkeletonLine className="w-32" />
          <span className="w-px h-4 bg-zinc-700" />
          <SkeletonLine className="w-40" />
        </div>
      </div>

      {/* Content Skeleton */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-6 p-6">
          {/* Request Overview */}
          <div className="space-y-2">
            <SectionTitle>
              <SkeletonLine className="w-32" />
            </SectionTitle>
            <SkeletonTable rows={4} />
          </div>

          {/* Headers */}
          <div className="space-y-2">
            <SectionTitle>
              <SkeletonLine className="w-24" />
            </SectionTitle>
            <SkeletonTable rows={6} />
          </div>

          {/* Query Parameters */}
          <div className="space-y-2">
            <SectionTitle>
              <SkeletonLine className="w-36" />
            </SectionTitle>
            <SkeletonTable rows={2} />
          </div>

          {/* Request Body */}
          <div className="space-y-2">
            <SectionTitle>
              <SkeletonLine className="w-28" />
            </SectionTitle>
            <SkeletonCodeBlock />
          </div>
        </div>
      </div>
    </div>
  );
}
