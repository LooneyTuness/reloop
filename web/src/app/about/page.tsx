import type { Metadata } from "next";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About - vtoraraka | Sustainable Fashion Mission",
  description:
    "Learn about vtoraraka's mission to revolutionize fashion consumption through sustainable marketplace",
};

export default function AboutPage() {
  return (
    <main>
      <About />
    </main>
  );
}
