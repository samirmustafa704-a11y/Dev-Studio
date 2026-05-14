import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/use-auth";
import { PageHeader, PageContainer } from "@/components/layout";
import { Input } from "@/components/tools/shared";

export const Route = createFileRoute("/profile")({
  head: () => ({ meta: [{ title: "Profile — Dev Studio" }] }),
  component: ProfilePage,
});

function ProfilePage() {
  const { user, isReady } = useAuth();
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!isReady || !user) return;
    (async () => {
      const { data, error } = await supabase
        .from("profiles")
        .select("display_name, avatar_url")
        .eq("id", user.id)
        .maybeSingle();
      if (error) toast.error(error.message);
      setDisplayName(data?.display_name ?? "");
      setAvatarUrl(data?.avatar_url ?? "");
      setLoading(false);
    })();
  }, [isReady, user]);

  const onSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    setSaving(true);
    const { error } = await supabase
      .from("profiles")
      .upsert({ id: user.id, display_name: displayName, avatar_url: avatarUrl });
    setSaving(false);
    if (error) return toast.error(error.message);
    toast.success("Profile saved");
  };

  return (
    <PageContainer className="overflow-y-auto">
      <div className="px-4 sm:px-8 pt-6 sm:pt-8 pb-4 sm:pb-6 border-b border-border bg-background">
        <div className="max-w-[1400px] mx-auto">
          <PageHeader eyebrow="Account" title="Profile" description="Manage your personal account settings." className="mb-8" />
        </div>
      </div>
      <div className="flex-1 p-4 sm:p-8">
        <div className="max-w-[600px] mx-auto">
          {loading ? (
            <div className="flex items-center gap-2 text-muted-foreground text-sm">
              <Loader2 className="size-4 animate-spin" /> Loading…
            </div>
          ) : (
            <form onSubmit={onSave} className="space-y-4 rounded-lg border border-border bg-card p-5 shadow-sm">
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Email</label>
                <Input
                  disabled
                  value={user?.email ?? ""}
                  className="mt-1.5 opacity-60 cursor-not-allowed bg-muted"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Display name</label>
                <Input
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  className="mt-1.5"
                  placeholder="Your public name"
                />
              </div>
              <div>
                <label className="text-[10px] font-mono uppercase tracking-widest text-muted-foreground">Avatar URL</label>
                <Input
                  value={avatarUrl}
                  onChange={(e) => setAvatarUrl(e.target.value)}
                  className="mt-1.5 font-mono"
                  placeholder="https://github.com/username.png"
                />
              </div>
              <div className="pt-2">
                <button
                  disabled={saving}
                  className="inline-flex items-center gap-2 bg-primary text-primary-foreground text-xs font-mono uppercase tracking-wider px-4 py-2 rounded shadow-sm hover:opacity-90 transition-all disabled:opacity-50"
                >
                  {saving && <Loader2 className="size-3.5 animate-spin" />}
                  Save Profile
                </button>
              </div>
            </form>
          )}
        </div>
      </div>
    </PageContainer>
  );
}