import Link from "next/link";
import { Metadata } from "next";
import { SignInForm } from "@/app/(auth)/sign-in/sign-in-form";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import * as Routes from "@/lib/routes";
import { SocialLoginForm } from "../social-login-form";

export const metadata: Metadata = {
  title: "Sign In | Bazzly",
  description: "Sign in to your Bazzly account",
};

export default function SignIn() {
  return (
    <div className="flex h-screen w-screen flex-col items-center justify-center">
      <div className="container mx-auto flex w-full flex-col justify-center space-y-6 sm:w-[350px]">
        <div className="flex flex-col space-y-2 text-center">
          <h1 className="text-3xl font-semibold tracking-tight">
            Welcome back
          </h1>
          <p className="text-lg text-muted-foreground">
            Sign in to your account to continue
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

            <SignInForm />
          </div>

          <div className="text-sm text-center text-muted-foreground">
            Don&apos;t have an account?{" "}
            <Link
              href={Routes.SIGN_UP.getPath()}
              className="underline underline-offset-4 hover:text-primary"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
