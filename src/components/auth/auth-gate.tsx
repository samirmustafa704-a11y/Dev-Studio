import { useEffect } from "react";
import { Outlet, useRouter, useRouterState } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { Loader2 } from "lucide-react";
import { AppShell } from "@/components/layout/app-shell";

const PUBLIC_ROUTES = ["/auth", "/reset-password"];

export function AuthGate() {
  const { isReady, user } = useAuth();
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const router = useRouter();
  const isPublic = PUBLIC_ROUTES.includes(pathname);

  useEffect(() => {
    if (isReady && !user && !isPublic) {
      router.navigate({ to: "/auth" });
    }
  }, [isReady, user, isPublic, router]);

  if (!isReady) {
    return (
      <div className="min-h-screen grid place-items-center bg-background">
        <Loader2 className="size-5 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (isPublic) {
    return <Outlet />;
  }

  if (!user) {
    return null;
  }

  return (
    <AppShell>
      <Outlet />
    </AppShell>
  );
}
