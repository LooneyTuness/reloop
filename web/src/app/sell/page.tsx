import type { Metadata } from "next";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Sell Items - vtoraraka | Turn Your Closet Into Cash",
  description:
    "Sell your pre-loved fashion items on vtoraraka and earn money while helping the environment",
};

export default function SellPage() {
  // Redirect to seller application page
  redirect('/seller-application');
}
