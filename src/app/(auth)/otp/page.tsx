import { Metadata } from "next";
import OTPForm from "@/features/otp/form";

export const metadata: Metadata = {
  title: "Sign in",
  description: "Enter your credentials and sign in",
};

export default function OTPPage() {
  return (
    <main className="grid place-items-center h-screen">
      <OTPForm />
    </main>
  );
}
