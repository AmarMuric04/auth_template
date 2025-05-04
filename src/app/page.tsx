import { Navbar } from "@/components/navbar";
import CTA from "@/components/sections/cta/default";
import FooterSection from "@/components/sections/footer/default";
import Hero from "@/components/sections/hero/default";
import Pricing from "@/components/sections/pricing/default";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home page",
  description: "Welcome to the home page!",
};

export default function HomePage() {
  return (
    <main className="h-screen">
      <Navbar />
      <Hero />
      <Pricing />
      <CTA />
      <FooterSection />
    </main>
  );
}
