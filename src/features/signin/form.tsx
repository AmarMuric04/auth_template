"use client";

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
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { z } from "zod";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/use-auth-store";
import { useEffect } from "react";
import OAuthButtons from "@/components/oauth-buttons";
import OrSeparator from "@/components/or-separator";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

interface APIErrorResponse {
  errors: Record<string, string>;
}

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export default function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { authData, setAuthData, setType, type } = useAuthStore();

  useEffect(() => {
    setType("signin");
  }, [setType]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) =>
      axios.post("/api/otp/send_otp", {
        email: values.email,
        type,
      }),
    onSuccess: ({ data }) => {
      if (data.success) {
        setAuthData({ ...authData, email: form.getValues().email });
        router.push("/otp");
      }
    },
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

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  return (
    <Card className="w-[450px] glass-3">
      <CardHeader>
        <CardTitle>Sign into an account</CardTitle>
        <CardDescription>Please enter your email</CardDescription>
      </CardHeader>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <CardContent className="space-y-4">
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
        Don&#39;t have an account?{" "}
        <Link
          href="/signup"
          className="font-medium underline-offset-4 underline"
        >
          Create one!
        </Link>
      </p>
    </Card>
  );
}
