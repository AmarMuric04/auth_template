import { Metadata } from "next";
import SignInForm from "@/features/signin/form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Enter your credentials and sign in",
};

export default async function ProfileForm() {
  return (
    <main className="grid place-items-center h-screen">
      <SignInForm />
    </main>
  );
}
