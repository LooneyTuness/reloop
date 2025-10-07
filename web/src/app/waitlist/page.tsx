import type { Metadata } from "next";
import Waitlist from "@/components/Waitlist";

export const metadata: Metadata = {
  title:
    "Join Waitlist - vtoraraka | Be First to Experience Sustainable Fashion",
  description:
    "Join the vtoraraka waitlist and be among the first to experience our sustainable fashion marketplace",
};

export default function WaitlistPage() {
  return <Waitlist />;
}
