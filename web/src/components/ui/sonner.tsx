import {
  CircleCheckIcon,
  InfoIcon,
  Loader2Icon,
  OctagonXIcon,
  TriangleAlertIcon,
} from "lucide-react";
import { Toaster as Sonner, type ToasterProps } from "sonner";

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      theme="dark"
      className="toaster group"
      icons={{
        success: <CircleCheckIcon className="size-4 text-emerald-700" />,
        info: <InfoIcon className="size-4" />,
        warning: <TriangleAlertIcon className="size-4" />,
        error: <OctagonXIcon className="size-4" />,
        loading: <Loader2Icon className="size-4 animate-spin" />,
      }}
      toastOptions={{
        style: {
          background: "#18181b", // zinc-800
          color: "#e4e4e7", // zinc-200
          border: "1px solid #27272a", // zinc-700
        },
        classNames: {
          toast: "bg-zinc-800 text-zinc-200 border-zinc-700",
          title: "text-zinc-200",
          description: "text-zinc-400",
          actionButton: "bg-zinc-700 text-zinc-200 hover:bg-zinc-600",
          cancelButton: "bg-zinc-700 text-zinc-200 hover:bg-zinc-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };

