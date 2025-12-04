import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { webhookListSchema } from "../http/schemas/webhooks";
import { WebhooksListItem } from "./webhooks-list-item";
import { Loader2Icon, Wand2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { twMerge } from "tailwind-merge";
import * as Dialog from "@radix-ui/react-dialog";
import { CodeBlock } from "./ui/code-block";

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>(null);

  const [checkedWebhooksIds, setCheckedWebhooksIds] = useState<string[]>([]);
  const [generatedHandlerCode, setGeneratedHandlerCode] = useState<
    string | null
  >(null);

  const { data, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useSuspenseInfiniteQuery({
      queryKey: ["webhooks"],
      queryFn: async ({ pageParam }) => {
        const url = new URL("http://localhost:3333/api/webhooks");

        if (pageParam) {
          url.searchParams.set("cursor", pageParam);
        }

        const response = await fetch(url.toString());
        const data = await response.json();

        return webhookListSchema.parse(data);
      },
      getNextPageParam: (lastPage) => {
        return lastPage.nextCursor ?? undefined;
      },
      initialPageParam: undefined as string | undefined,
    });

  const webhooks = data.pages.flatMap((page) => page.webhooks);

  useEffect(() => {
    if (observerRef.current) {
      observerRef.current.disconnect();
    }

    observerRef.current = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry?.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        threshold: 0.2,
      }
    );

    if (loadMoreRef.current) {
      observerRef.current.observe(loadMoreRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [hasNextPage, isFetchingNextPage, fetchNextPage]);

  function handleCheckedWebhook(checkedWebhookId: string) {
    if (checkedWebhooksIds.includes(checkedWebhookId)) {
      setCheckedWebhooksIds((state) => {
        return state.filter((webhookId) => webhookId !== checkedWebhookId);
      });
    } else {
      setCheckedWebhooksIds((state) => [...state, checkedWebhookId]);
    }
  }

  async function handleGenerateHandler() {
    const response = await fetch("http://localhost:3333/api/generate", {
      method: "POST",
      body: JSON.stringify({ webhookIds: checkedWebhooksIds }),
      headers: {
        "Content-Type": "application/json",
      },
    });

    type GenerateResponse = { code: string };

    const data: GenerateResponse = await response.json();

    setGeneratedHandlerCode(data.code);
  }

  const hasAnyWebhookChecked = checkedWebhooksIds.length > 0;

  return (
    <>
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        <div className="space-y-1 p-2">
          <button
            className={twMerge(
              "bg-indigo-400 text-white w-full rounded-lg flex items-center justify-center gap-3 font-medium text-sm py-2 mb-2",
              "disabled:opacity-50 disabled:cursor-not-allowed",
              "hover:bg-indigo-500 hover:transition-colors hover:duration-150 hover:cursor-pointer"
            )}
            disabled={!hasAnyWebhookChecked}
            onClick={() => handleGenerateHandler()}
          >
            <Wand2 className="size-4" />
            Gerar Handler
          </button>

          {webhooks.map((webhook) => (
            <WebhooksListItem
              key={webhook.id}
              id={webhook.id}
              method={webhook.method}
              pathname={webhook.pathname}
              createdAt={webhook.createdAt}
              onWebhookChecked={handleCheckedWebhook}
              isWebhookChecked={checkedWebhooksIds.includes(webhook.id)}
            />
          ))}
        </div>

        {hasNextPage && (
          <div className="p-2" ref={loadMoreRef}>
            {isFetchingNextPage && (
              <div className="flex justify-center py-2 items-center">
                <Loader2Icon className="size-4 animate-spin text-zinc-500" />
              </div>
            )}
          </div>
        )}
      </div>

      {!!generatedHandlerCode && (
        <Dialog.Root defaultOpen>
          <Dialog.Overlay className="bg-black/60 inset-0 fixed z-20">
            <Dialog.Content className="flex items-center justify-center fixed left-1/2 top-1/2 max-h-[85vh] w-[90vw] -translate-x-1/2 -translate-y-1/2 z-40">
              <div className="bg-zinc-900 w-[800px] p-4 rounded-lg border border-zinc-800 max-h-[800px] overflow-y-auto custom-scrollbar">
                <CodeBlock language="typescript" code={generatedHandlerCode} />
              </div>
            </Dialog.Content>
          </Dialog.Overlay>
        </Dialog.Root>
      )}
    </>
  );
}

