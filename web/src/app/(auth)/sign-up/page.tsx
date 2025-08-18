import Link from "next/link";
import { Metadata } from "next";
import { SignUpForm } from "@/app/(auth)/sign-up/sign-up-form";
import * as Routes from "@/lib/routes";
import { SocialLoginForm } from "../social-login-form";

export const metadata: Metadata = {
  title: "Sign Up | Bazzly",
  description: "Create your Bazzly account",
};

export default function SignUp() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="container mx-auto flex w-full flex-col justify-center space-y-8 sm:w-[400px]">
        <div className="flex flex-col space-y-3 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Create your Bazzly account
          </h1>
          <p className="text-lg text-muted-foreground">
            Start driving qualified traffic on autopilot
          </p>
        </div>

        <div className="flex flex-col space-y-6">
          <div className="grid gap-6">
            <SocialLoginForm />

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">
                  Or continue with
                </span>
              </div>
            </div>

            <SignUpForm />
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
