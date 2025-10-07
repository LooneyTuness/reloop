import type { Metadata } from "next";
import SellItem from "@/components/SellItem";
import ProtectedRoute from "@/utils/ProtectedRoute";

export const metadata: Metadata = {
  title: "Sell Items - vtoraraka | Turn Your Closet Into Cash",
  description:
    "Sell your pre-loved fashion items on vtoraraka and earn money while helping the environment",
};

export default function SellPage() {
  return (
    <main>
      <ProtectedRoute>
        <SellItem />
      </ProtectedRoute>
    </main>
  );
}
