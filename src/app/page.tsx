import { Navbar } from "@/components/navbar";
import Hero from "@/components/sections/hero/default";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Home page",
  description: "Welcome to the home page!",
};

export default async function ProfileForm() {
  return (
    <main className="h-screen">
      <Navbar />
      <Hero />
    </main>
  );
}
