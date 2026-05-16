import { useNavigate } from "@tanstack/react-router";

export function ResetPasswordForm() {
  const navigate = useNavigate();
  return (
    <div className="rounded-lg border border-border bg-card p-6 space-y-4 shadow-sm text-center">
      <p className="text-sm text-muted-foreground">
        Password reset is managed through your Replit account.
      </p>
      <button
        onClick={() => navigate({ to: "/auth" })}
        className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-sm font-medium px-4 py-2 rounded-md hover:opacity-90 transition-all"
      >
        Back to sign in
      </button>
    </div>
  );
}
