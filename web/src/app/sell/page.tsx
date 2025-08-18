import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import SellItem from "@/components/SellItem";
import ProtectedRoute from "@/utils/ProtectedRoute";

export const metadata: Metadata = {
  title: "Sell Items - Reloop | Turn Your Closet Into Cash",
  description:
    "Sell your pre-loved fashion items on Reloop and earn money while helping the environment",
};

export default function SellPage() {
  return (
    <>
      <Navbar />
      <main>
        <ProtectedRoute>
          <SellItem />
        </ProtectedRoute>
      </main>
    </>
  );
}
