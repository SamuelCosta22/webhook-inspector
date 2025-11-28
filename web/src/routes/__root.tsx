import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createRootRoute, Outlet } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";
import { Panel, PanelGroup, PanelResizeHandle } from "react-resizable-panels";
import { Sidebar } from "../components/sidebar";
import { Toaster } from "../components/ui/sonner";

const queryClient = new QueryClient();

const RootLayout = () => (
  <QueryClientProvider client={queryClient}>
    <div className="h-screen overflow-hidden">
      <PanelGroup direction="horizontal" className="h-full">
        <Panel
          defaultSize={20}
          minSize={22}
          maxSize={30}
          className="overflow-hidden"
        >
          <Sidebar />
        </Panel>

        <PanelResizeHandle className="w-px bg-zinc-700 hover:bg-zinc-600 transition-colors duration-150" />

        <Panel defaultSize={80} minSize={60} className="overflow-hidden">
          <Outlet />
          <TanStackRouterDevtools />
        </Panel>
      </PanelGroup>
    </div>
    <Toaster position="bottom-right" />
  </QueryClientProvider>
);

export const Route = createRootRoute({ component: RootLayout });

