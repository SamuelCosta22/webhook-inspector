function SkeletonLine({ className = "" }: { className?: string }) {
  return (
    <div className={`h-4 bg-zinc-800 rounded animate-pulse ${className}`} />
  );
}

function SkeletonCheckbox() {
  return <div className="h-4 w-4 bg-zinc-800 rounded animate-pulse" />;
}

function SkeletonBadge() {
  return <div className="h-4 w-12 bg-zinc-800 rounded animate-pulse" />;
}

function SkeletonIconButton() {
  return <div className="h-6 w-6 bg-zinc-800 rounded animate-pulse" />;
}

function WebhooksListItemSkeleton() {
  return (
    <div className="rounded-lg transition-colors duration-150">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <SkeletonCheckbox />
        <div className="flex flex-1 min-w-0 items-start gap-3">
          <SkeletonBadge />
          <div className="flex-1 min-w-0 space-y-1.5">
            <SkeletonLine className="w-full max-w-[200px]" />
            <SkeletonLine className="w-20" />
          </div>
        </div>
        <SkeletonIconButton />
      </div>
    </div>
  );
}

export function WebhooksListSkeleton() {
  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="space-y-1 p-2">
        {Array.from({ length: 20 }).map((_, i) => (
          <WebhooksListItemSkeleton key={i} />
        ))}
      </div>
    </div>
  );
}
