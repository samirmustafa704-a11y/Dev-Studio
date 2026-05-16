import { createFileRoute } from "@tanstack/react-router";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader, PageContainer } from "@/components/layout";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Dev Studio" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user } = useAuth();

  return (
    <PageContainer className="overflow-y-auto">
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto">
          <PageHeader
            eyebrow="Account"
            title="Profile"
            description="Your Replit account details."
            className="mb-8"
          />
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-[600px] mx-auto">
          <div className="rounded-lg border border-border bg-card p-5 shadow-sm space-y-4">
            <div className="flex items-center gap-4">
              {user?.profileImage ? (
                <img
                  src={user.profileImage}
                  alt={user.name}
                  className="size-14 rounded-full object-cover"
                />
              ) : (
                <div className="size-14 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-lg font-semibold text-primary-foreground">
                  {(user?.name ?? "?").slice(0, 1).toUpperCase()}
                </div>
              )}
              <div>
                <p className="font-semibold">{user?.name ?? "—"}</p>
                {user?.email && (
                  <p className="text-sm text-muted-foreground">{user.email}</p>
                )}
              </div>
            </div>
            <p className="text-xs text-muted-foreground">
              Profile information is managed through your Replit account.
            </p>
          </div>
        </div>
      </div>
    </PageContainer>
  );
}
