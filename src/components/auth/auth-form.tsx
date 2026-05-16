import { Flame } from "lucide-react";

export function AuthForm() {
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-5 shadow-sm">
      <div className="text-center space-y-2">
        <p className="text-sm text-muted-foreground">
          Sign in with your Replit account to access Dev Studio.
        </p>
      </div>
      <a
        href="/api/auth/login"
        className="w-full inline-flex items-center justify-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-3 py-2.5 rounded-md transition-all hover:opacity-90 active:scale-[0.98]"
      >
        <Flame className="size-4" />
        Log in with Replit
      </a>
    </div>
  );
}
