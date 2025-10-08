"use client";

import Link from "next/link";
import { SignInForm } from "@/app/(auth)/sign-in/sign-in-form";
import { useLanguage } from "@/contexts/LanguageContext";

export default function SignIn() {
  const { t } = useLanguage();

  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            {t("loginTitle")}
          </h1>
          <p className="text-lg text-muted-foreground">
            {t("loginSubtitle")}
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          <SignInForm />

          <div className="text-sm text-center text-muted-foreground">
            {t("dontHaveAccount")}{" "}
            <Link
              href="/sign-up"
              className="underline underline-offset-4 hover:text-primary font-medium"
            >
              {t("join")}
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
