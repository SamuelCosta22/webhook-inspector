import { useSuspenseInfiniteQuery } from "@tanstack/react-query";
import { webhookListSchema } from "../http/schemas/webhooks";
import { WebhooksListItem } from "./webhooks-list-item";
import { Loader2Icon } from "lucide-react";
import { useEffect, useRef } from "react";

export function WebhooksList() {
  const loadMoreRef = useRef<HTMLDivElement>(null);
  const observerRef = useRef<IntersectionObserver>(null);

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

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar">
      <div className="space-y-1 p-2">
        {webhooks.map((webhook) => (
          <WebhooksListItem
            key={webhook.id}
            id={webhook.id}
            method={webhook.method}
            pathname={webhook.pathname}
            createdAt={webhook.createdAt}
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
  );
}

