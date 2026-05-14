import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  createRootRouteWithContext,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";

import appCss from "../styles.css?url";
import { NotFoundComponent, ErrorComponent } from "@/components/layout";
import { AuthGate } from "@/components/auth/auth-gate";
import { Toaster } from "@/components/ui/sonner";
import { AuthProvider } from "@/hooks/use-auth";

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Dev Studio — Personal AI Dev Hub" },
      { name: "description", content: "Save, organize, search and reuse prompts, AI agents, components, templates and snippets — your full-stack dev brain." },
      { name: "author", content: "ForgeDev" },
      { property: "og:title", content: "Dev Studio — Personal AI Dev Hub" },
      { property: "og:description", content: "Save, organize, search and reuse prompts, AI agents, components, templates and snippets — your full-stack dev brain." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
      { name: "twitter:title", content: "Dev Studio — Personal AI Dev Hub" },
      { name: "twitter:description", content: "Save, organize, search and reuse prompts, AI agents, components, templates and snippets — your full-stack dev brain." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5d1e14ca-fb80-423c-bfbd-57e81c9e2d0b/id-preview-d2661750--46618578-b256-4b0f-9be4-cc4f513e2ea5.lovable.app-1778590913844.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/5d1e14ca-fb80-423c-bfbd-57e81c9e2d0b/id-preview-d2661750--46618578-b256-4b0f-9be4-cc4f513e2ea5.lovable.app-1778590913844.png" },
    ],
    links: [
      { rel: "icon", href: "/favicon.svg", type: "image/svg+xml" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      {
        rel: "stylesheet",
        href: "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500&display=swap",
      },
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthGate />
      </AuthProvider>
      <Toaster richColors position="top-right" />
    </QueryClientProvider>
  );
}
