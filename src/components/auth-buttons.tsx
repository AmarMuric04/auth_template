"use client";

import { signOut, useSession } from "next-auth/react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { Button } from "./ui/button";

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
  const { status } = useSession();

  const { data, isLoading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      const response = await axios.get("/api/auth/me");

      return response.data;
    },
    refetchOnWindowFocus: false,
    staleTime: 1000 * 60 * 5,
    enabled: status === "unauthenticated",
  });

  const isAuthenticated = status === "authenticated" || !!data?.user;

  if (isLoading || status === "loading") return null;

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
