"use client";

import { signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import axios from "axios";

type AuthButtonsProps = {
  auth?: {
    login: {
      title: string;
      url: string;
    };
    signup: {
      title: string;
      url: string;
    };
  };
};

const AuthButtons = ({
  auth = {
    login: { title: "Sign in", url: "/signin" },
    signup: { title: "Sign up", url: "/signup" },
  },
}: AuthButtonsProps) => {
  const { data: session } = useSession();
  const [hasToken, setHasToken] = useState(false);

  useEffect(() => {
    const checkToken = async () => {
      const res = await fetch("/api/auth/me");
      const data = await res.json();
      setHasToken(!!data.user);
    };
    checkToken();
  }, [session]);

  const isAuthenticated = session || hasToken;

  return (
    <div className="flex gap-3 items-center">
      {!isAuthenticated ? (
        <>
          <Button asChild variant="outline">
            <a href={auth.login.url}>{auth.login.title}</a>
          </Button>
          <Button asChild>
            <a href={auth.signup.url}>{auth.signup.title}</a>
          </Button>
        </>
      ) : (
        <Button
          variant="outline"
          onClick={async () => {
            await axios.post("/api/signout");

            signOut({ callbackUrl: "/" });
          }}
        >
          Sign Out
        </Button>
      )}
    </div>
  );
};

export default AuthButtons;
