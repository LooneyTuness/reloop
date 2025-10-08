"use client";

import Link from "next/link";
import { SignUpForm } from "@/app/(auth)/sign-up/sign-up-form";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SignUp() {
  const { t } = useLanguage();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="container mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
        <div className="flex flex-col space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("signUpTitle")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("signUpSubtitle")}
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          <SignUpForm />

          <div className="text-sm text-center text-muted-foreground">
            {t("alreadyHaveAccount")}{" "}
            <Link
              href="/sign-in"
              className="underline underline-offset-4 hover:text-primary font-medium"
            >
              {t("signIn")}
            </Link>
          </div>

          <div className="text-xs text-center text-muted-foreground">
            By continuing, you acknowledge that you understand and agree to our{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link
              href="#"
              className="underline underline-offset-4 hover:text-primary"
            >
              Privacy Policy
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
