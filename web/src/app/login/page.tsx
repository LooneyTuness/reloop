import type { Metadata } from "next";
import Login from "@/components/Login";
import AuthDebug from "@/components/AuthDebug";
import SupabaseTest from "@/components/SupabaseTest";

export const metadata: Metadata = {
  title: "Login - vtoraraka | Access Your Account",
  description:
    "Login to your vtoraraka account to buy and sell pre-loved fashion",
};

export default function LoginPage() {
  return (
    <div>
      <Login />
      <div className="mt-8 space-y-8">
        <AuthDebug />
        <SupabaseTest />
      </div>
    </div>
  );
}
