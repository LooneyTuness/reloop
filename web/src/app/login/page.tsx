import type { Metadata } from "next";
import Login from "@/components/Login";

export const metadata: Metadata = {
  title: "Login - vtoraraka | Access Your Account",
  description:
    "Login to your vtoraraka account to buy and sell pre-loved fashion",
};

export default function LoginPage() {
  return <Login />;
}
