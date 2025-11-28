import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="h-screen bg-zinc-900">
      <div className="flex h-full items-center justify-center">
        <div className="flex flex-col items-center justify-center gap-1 p-8 text-center">
          <h3 className="text-lg font-semibold text-zinc-200">No webhooks selected</h3>
          <p className="text-zinc-400 max-w-md text-sm">
            Select a webhook from the left sidebar to view more details
          </p>
        </div>
      </div>
    </div>
  );
}

