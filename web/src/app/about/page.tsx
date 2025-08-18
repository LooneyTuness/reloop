import type { Metadata } from "next";
import Navbar from "@/components/Navbar";
import About from "@/components/About";

export const metadata: Metadata = {
  title: "About - Reloop | Sustainable Fashion Mission",
  description:
    "Learn about Reloop's mission to revolutionize fashion consumption through sustainable marketplace",
};

export default function AboutPage() {
  return (
    <>
      <Navbar />
      <main>
        <About />
      </main>
    </>
  );
}
