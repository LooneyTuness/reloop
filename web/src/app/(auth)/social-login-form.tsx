"use client";

import { GoogleIcon } from "@/components/icons";
import { Button } from "@/components/ui/button";

import { ButtonProps } from "@/components/ui/button";
import { useSignInWithSocial } from "../api/auth/sign-in/sign-in.hook";

export function SocialLoginForm() {
  const signInWithSocial = useSignInWithSocial();

  return (
    <div className="flex flex-col gap-4">
      <SocialLoginButton
        icon={<GoogleIcon />}
        onClick={() => signInWithSocial.mutate("google")}
        disabled={signInWithSocial.isPending}
      >
        Continue with Google
      </SocialLoginButton>
    </div>
  );
}

interface SocialLoginButtonProps extends ButtonProps {
  icon: React.ReactNode;
}

function SocialLoginButton({
  icon,
  children,
  ...props
}: SocialLoginButtonProps) {
  return (
    <Button
      variant="outline"
      className="w-full flex items-center gap-2 bg-white hover:bg-gray-50"
      {...props}
    >
      {icon}
      {children}
    </Button>
  );
}
