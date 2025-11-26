import { Badge } from "./ui/badge";

export function WebhookDetailHeader() {
  return (
    <div className="space-y-2 border-b border-zinc-700 p-4">
      <div className="flex items-center gap-3">
        <Badge>POST</Badge>
        <span className="text-lg font-medium text-zinc-300">/video/status</span>
      </div>
      <div className="flex items-center gap-2">
        <div className="flex items-center gap-1 text-sm text-zinc-400">
          <span>From IP</span>
          <span className="font-mono underline-offset-4 underline">
            127.0.0.1
          </span>
        </div>
        <span className="w-px h-4 bg-zinc-500" />
        <div className="flex items-center gap-2 text-sm text-zinc-400">
          <span>at</span>
          <span className="font-mono">April 18th, 18pm</span>
        </div>
      </div>
    </div>
  );
}
