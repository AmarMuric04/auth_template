"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "./ui/button";

export default function OAuthButtons() {
  const { data: session } = useSession();

  if (session) {
    return (
      <div>
        <p>Signed in as {session.user?.email}</p>
        <button onClick={() => signOut()}>Sign out</button>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 px-6">
      <Button onClick={() => signIn("google")}>Sign in with Google</Button>
      <Button onClick={() => signIn("github")}>Sign in with Github</Button>
    </div>
  );
}
