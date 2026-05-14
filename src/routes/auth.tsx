import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/use-auth";
import { AuthLayout } from "@/components/auth/auth-layout";
import { AuthForm } from "@/components/auth/auth-form";
import { ResetPasswordForm } from "@/components/auth/reset-password-form";

export const Route = createFileRoute("/auth")({
  head: () => ({
    meta: [
      { title: "Authentication — Dev Studio" },
      { name: "description", content: "Sign in or create an account for your Dev Studio." },
    ],
  }),
  component: AuthPage,
});

function AuthPage() {
  const navigate = useNavigate();
  const { user, isReady } = useAuth();
  const [isRecovery, setIsRecovery] = useState(false);

  useEffect(() => {
    if (window.location.hash.includes("type=recovery")) {
      setIsRecovery(true);
    }
  }, []);

  useEffect(() => {
    // Only redirect signed-in users if they are NOT in the middle of a password reset
    if (isReady && user && !isRecovery) {
      navigate({ to: "/" });
    }
  }, [isReady, user, navigate, isRecovery]);

  return (
    <AuthLayout showBackHome={!isRecovery}>
      {isRecovery ? <ResetPasswordForm /> : <AuthForm />}
    </AuthLayout>
  );
}