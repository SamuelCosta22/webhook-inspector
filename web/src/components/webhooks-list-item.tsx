import { Link } from "@tanstack/react-router";
import { CopyIcon, Trash2Icon } from "lucide-react";
import { IconButton } from "./ui/icon-button";
import { Checkbox } from "./ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";
import { formatMethodColor } from "../constants/format-method-color";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "./ui/alert-dialog";

interface WebhooksListItemProps {
  id: string;
  method: string;
  pathname: string;
  createdAt: string;
  onWebhookChecked: (webhookId: string) => void;
  isWebhookChecked: boolean;
}

export function WebhooksListItem({
  id,
  method,
  pathname,
  createdAt,
  onWebhookChecked,
  isWebhookChecked,
}: WebhooksListItemProps) {
  const queryClient = useQueryClient();

  const { mutate: deleteWebhook } = useMutation({
    mutationFn: async (id: string) => {
      await fetch(`http://localhost:3333/api/webhooks/${id}`, {
        method: "DELETE",
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["webhooks"] });
      toast.success("Webhook deleted successfully");
    },
    onError: (error) => {
      toast.error("Failed to delete webhook", {
        description: error.message,
      });
    },
  });

  const handleCopyId = async () => {
    try {
      await navigator.clipboard.writeText(id);
      toast.success("ID copied to clipboard");
    } catch (error) {
      toast.error("Failed to copy ID", {
        description: error instanceof Error ? error.message : "Unknown error",
      });
    }
  };

  return (
    <div className="rouded-lg transition-colors duration-150 hover:bg-zinc-700/50 group">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox
          onCheckedChange={() => onWebhookChecked(id)}
          checked={isWebhookChecked}
        />
        <Link
          to="/webhooks/$id"
          params={{ id }}
          className="flex flex-1 min-w-0 items-start gap-3"
        >
          <span
            className={twMerge(
              "w-12 shrink-0 font-mono text-xs font-semibold text-zinc-300 text-right",
              formatMethodColor(method)
            )}
          >
            {method}
          </span>
          <div className="flex-1 min-w-0">
            <p className="truncate text-xs text-zinc-200 leading-tight font-mono hover:underline">
              {pathname}
            </p>
            <p className="truncate text-[11px] text-emerald-700 leading-tight font-mono mt-1">
              ID: {id}
            </p>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </p>
          </div>
        </Link>

        <div className="flex items-center gap-1">
          <AlertDialog>
            <AlertDialogTrigger>
              <IconButton
                icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
                className={twMerge(
                  "opacity-0 transition-opacity group-hover:opacity-100",
                  "hover:bg-red-700/80 p-1.5 rounded-lg hover:cursor-pointer"
                )}
              />
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-zinc-900 border-zinc-600">
              <AlertDialogHeader>
                <AlertDialogTitle className="text-zinc-200 text-center">Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400 text-center">
                  This action cannot be undone. This will permanently delete
                  this webhook.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel className="bg-zinc-700 hover:bg-zinc-600 text-zinc-200 hover:cursor-pointer border-zinc-600">Cancel</AlertDialogCancel>
                <AlertDialogAction className="bg-red-700/80 hover:bg-red-600/80 text-zinc-200 hover:cursor-pointer border-red-600" onClick={() => deleteWebhook(id)}>
                  Delete
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>

          <IconButton
            icon={<CopyIcon className="size-3.5 text-zinc-400" />}
            className={twMerge(
              "opacity-0 transition-opacity group-hover:opacity-100",
              "hover:bg-zinc-300/30 p-1.5 rounded-lg hover:cursor-pointer"
            )}
            onClick={handleCopyId}
          />
        </div>
      </div>
    </div>
  );
}

