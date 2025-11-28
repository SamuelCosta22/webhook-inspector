import { Link } from "@tanstack/react-router";
import { Trash2Icon } from "lucide-react";
import { IconButton } from "./ui/icon-button";
import { Checkbox } from "./ui/checkbox";
import { formatDistanceToNow } from "date-fns";
import { twMerge } from "tailwind-merge";
import { formatMethodColor } from "../constants/format-method-color";

interface WebhooksListItemProps {
  id: string;
  method: string;
  pathname: string;
  createdAt: string;
}

export function WebhooksListItem({
  id,
  method,
  pathname,
  createdAt,
}: WebhooksListItemProps) {
  return (
    <div className="rouded-lg transition-colors duration-150 hover:bg-zinc-700/50 group">
      <div className="flex items-start gap-3 px-4 py-2.5">
        <Checkbox />
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
            <p className="truncate text-xs text-zinc-200 leading-tight font-mono">
              {pathname}
            </p>
            <p className="text-xs text-zinc-500 font-medium mt-1">
              {formatDistanceToNow(createdAt, { addSuffix: true })}
            </p>
          </div>
        </Link>

        <IconButton
          icon={<Trash2Icon className="size-3.5 text-zinc-400" />}
          className={twMerge(
            "opacity-0 transition-opacity group-hover:opacity-100",
            "hover:bg-zinc-500 p-1.5 rounded-lg hover:cursor-pointer"
          )}
        />
      </div>
    </div>
  );
}

