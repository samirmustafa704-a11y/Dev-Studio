import { Link, useNavigate } from "@tanstack/react-router";
import { LogOut } from "lucide-react";
import { useAuth } from "@/hooks/use-auth";

export function UserMenu() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="mt-3 flex items-center gap-2 px-1">
      <Link to="/profile" className="flex items-center gap-2.5 flex-1 min-w-0 group">
        <div className="size-7 rounded-full bg-gradient-to-br from-primary to-accent grid place-items-center text-[10px] font-semibold text-primary-foreground">
          {(user?.email ?? "?").slice(0, 1).toUpperCase()}
        </div>
        <div className="flex flex-col leading-tight min-w-0">
          <span className="text-xs font-medium truncate group-hover:text-foreground transition-colors">
            {user?.user_metadata?.display_name ?? user?.email?.split("@")[0] ?? "Account"}
          </span>
          <span className="text-[10px] text-muted-foreground truncate">{user?.email}</span>
        </div>
      </Link>
      <button
        onClick={async () => {
          await signOut();
          navigate({ to: "/auth" });
        }}
        title="Sign out"
        className="size-7 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50 transition-all active:scale-90"
      >
        <LogOut className="size-3.5" />
      </button>
    </div>
  );
}
