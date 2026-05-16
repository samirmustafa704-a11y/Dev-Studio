import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authentication — Dev Studio" },
      { name: "description", content: "Sign in to your Dev Studio." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isReady } = useAuth();

  useEffect(() => {
    if (isReady && user) {
      navigate({ to: "/" });
    }
  }, [isReady, user, navigate]);

  return (
    <AuthLayout showBackHome={false}>
      <AuthForm />
    </AuthLayout>
  );
}
