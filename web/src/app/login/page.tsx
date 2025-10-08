import type { Metadata } from "next";
import Login from "@/components/Login";
import AuthDebug from "@/components/AuthDebug";

export const metadata: Metadata = {
  title: "Login - vtoraraka | Access Your Account",
  description:
    "Login to your vtoraraka account to buy and sell pre-loved fashion",
};

export default function LoginPage() {
  return (
    <div>
      <Login />
      <div className="mt-8">
        <AuthDebug />
      </div>
    </div>
  );
}
