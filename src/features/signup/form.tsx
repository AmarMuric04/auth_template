"use client";

import OAuthButtons from "@/components/oauth-buttons";
import OrSeparator from "@/components/or-separator";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useAuthStore } from "@/store/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { Loader2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";

interface APIErrorResponse {
  errors: Record<string, string>;
}

const formSchema = z.object({
  username: z.string().min(2, {
    message: "Username must be at least 2 characters.",
  }),
  email: z.string().email({ message: "Please enter a valid email." }),
  firstName: z.string().min(1, { message: "First name is required." }),
  lastName: z.string().min(1, { message: "Last name is required." }),
});

export default function SignUpForm(): React.JSX.Element {
  const router = useRouter();
  const { authData, setAuthData, setType, type } = useAuthStore();

  useEffect(() => {
    setType("signup");
  }, [setType]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      firstName: "",
      lastName: "",
    },
  });

  const mutation = useMutation({
    mutationFn: async (values: z.infer<typeof formSchema>) => {
      const { data } = await axios.post("/api/signup", JSON.stringify(values), {
        headers: { "Content-Type": "application/json" },
      });

      if (data.success) {
        await axios.post(
          "/api/otp/send_otp",
          JSON.stringify({ email: values.email, type }),
          { headers: { "Content-Type": "application/json" } }
        );
        setAuthData({ ...authData, ...values });
        router.push("/otp");
        return "success";
      }

      throw new Error("Signup failed");
    },
    onSuccess: () => toast.success("We sent a code to your email"),
    onError: (error: AxiosError<APIErrorResponse>) => {
      if (error.response?.data?.errors) {
        const errors = error.response.data.errors;
        Object.entries(errors).forEach(([field, message]) => {
          form.setError(field as keyof z.infer<typeof formSchema>, {
            type: "server",
            message,
          });
        });
      } else {
        toast.error("Something went wrong");
      }
    },
    retry: 10,
    retryDelay: 1000,
  });

  return (
    <Card className="w-[450px] glass-3">
      <CardHeader>
        <CardTitle>Create an account</CardTitle>
        <CardDescription>Please fill out the form</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => mutation.mutate(data))}
          className="space-y-8"
          data-testid="signup-form"
        >
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="username"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Username</FormLabel>
                  <FormControl>
                    <Input placeholder="shadcn" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input placeholder="John" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input placeholder="Doe" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="your@email.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </CardContent>
          <CardFooter>
            <Button
              className="w-full flex gap-2"
              type="submit"
              disabled={mutation.isPending}
            >
              {mutation.isPending && (
                <Loader2 size={16} className="animate-spin" />
              )}
              {mutation.isPending ? "Submitting..." : "Submit"}
            </Button>
          </CardFooter>
        </form>
      </Form>
      <OrSeparator />
      <OAuthButtons />
      <p className="text-center">
        Already have an account?{" "}
        <Link
          href="/signin"
          className="font-medium underline-offset-4 underline"
        >
          Sign in!
        </Link>
      </p>
    </Card>
  );
}
