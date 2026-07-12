import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { type ReactNode } from "react";

import appCss from "../styles.css?url";
import { SiteHeader } from "../components/site/site-header";
import { SiteFooter } from "../components/site/site-footer";
import { Toaster } from "sonner";

function NotFoundComponent() {
  return (
    <div className="min-h-screen">
      <SiteHeader />
      <div className="flex min-h-[60vh] items-center justify-center px-6">
        <div className="max-w-md text-center">
          <p className="eyebrow">404</p>
          <h1 className="mt-6 text-5xl">Page not found</h1>
          <p className="mt-4 text-sm text-muted-foreground">
            This page has moved, or was never here. Return to the studio.
          </p>
          <a href="/" className="mt-8 inline-block border border-foreground px-8 py-3 text-xs tracking-[0.28em] uppercase hover:bg-foreground hover:text-background transition-colors">
            Return home
          </a>
        </div>
      </div>
      <SiteFooter />
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  console.error(error);
  const router = useRouter();

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <div className="max-w-md text-center">
        <p className="eyebrow">Error</p>
        <h1 className="mt-6 text-3xl">This page didn't load</h1>
        <p className="mt-3 text-sm text-muted-foreground">
          Something went wrong. Try again, or return home.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-2">
          <button
            onClick={() => { router.invalidate(); reset(); }}
            className="border border-foreground px-6 py-2 text-xs tracking-[0.28em] uppercase hover:bg-foreground hover:text-background transition-colors"
          >Try again</button>
          <a href="/" className="border border-border px-6 py-2 text-xs tracking-[0.28em] uppercase hover:bg-secondary transition-colors">Go home</a>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "C. Beauty — Lash Extensions & Skincare in Farnborough" },
      { name: "description", content: "Editorial-luxe lash extensions, facials, chemical peels, LED, spray tans and brow waxing in Farnborough, Hampshire. Book online with a small deposit." },
      { name: "author", content: "C. Beauty" },
      { property: "og:title", content: "C. Beauty — Lash Extensions & Skincare in Farnborough" },
      { property: "og:description", content: "Editorial-luxe lash extensions and skincare in Farnborough, Hampshire." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "theme-color", content: "#F5EFE6" },
    ],
    links: [
      { rel: "stylesheet", href: appCss },
      { rel: "icon", href: "/favicon.ico", type: "image/x-icon" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Fraunces:opsz,wght@9..144,300;9..144,400;9..144,500&family=Manrope:wght@300;400;500;600&display=swap" },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head><HeadContent /></head>
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
      <Outlet />
      <Toaster position="top-center" theme="light" />
    </QueryClientProvider>
  );
}
