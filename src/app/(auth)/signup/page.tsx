import { Metadata } from "next";
import SignUpForm from "@/features/signup/form";

export const metadata: Metadata = {
  title: "Sign up",
  description: "Create an account",
};

export default async function ProfileForm() {
  return (
    <main className="grid place-items-center h-screen">
      <SignUpForm />
    </main>
  );
}
