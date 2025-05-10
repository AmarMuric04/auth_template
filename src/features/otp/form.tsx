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
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/store/use-auth-store";
import { zodResolver } from "@hookform/resolvers/zod";
import axios, { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { useEffect, useRef } from "react";
import { Loader2 } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";

interface APIErrorResponse {
  errors: Record<string, string>;
}

const formSchema = z.object({
  code: z.string().min(6, { message: "Enter the full 6-digit code" }),
});

export default function OTPForm(): React.JSX.Element {
  const router = useRouter();
  const { type, authData, clearAuthData } = useAuthStore();
  const isVerifyingRef = useRef(false);

  useEffect(() => {
    if (!authData.email && !isVerifyingRef.current) {
      router.replace("/signup");
    }
  }, [authData, router]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      code: "",
    },
  });

  const mutation = useMutation({
    mutationFn: (values: z.infer<typeof formSchema>) => {
      isVerifyingRef.current = true;
      return axios.post("/api/otp/verify_otp", {
        code: values.code,
        type,
        ...authData,
      });
    },
    onSuccess: async ({ data }) => {
      if (data.success) {
        clearAuthData();
        isVerifyingRef.current = false;
      }
    },
    onError: (error: AxiosError<APIErrorResponse>) => {
      isVerifyingRef.current = false;
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
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }

  if (!authData.email) {
    return (
      <div
        data-testid="loader"
        className="grid place-items-center h-screen animate-spin"
      >
        <Loader2 />
      </div>
    );
  }

  return (
    <Card className="glass-3">
      <CardHeader>
        <CardTitle>Enter the code</CardTitle>
        <CardDescription>We sent the code to your email</CardDescription>
      </CardHeader>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-8"
          data-testid="otp-form"
        >
          <CardContent className="space-y-4">
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Enter the code</FormLabel>
                  <FormControl>
                    <InputOTP
                      maxLength={6}
                      value={field.value}
                      onChange={field.onChange}
                    >
                      <InputOTPGroup>
                        <InputOTPSlot index={0} />
                        <InputOTPSlot index={1} />
                        <InputOTPSlot index={2} />
                      </InputOTPGroup>
                      <InputOTPSeparator />
                      <InputOTPGroup>
                        <InputOTPSlot index={3} />
                        <InputOTPSlot index={4} />
                        <InputOTPSlot index={5} />
                      </InputOTPGroup>
                    </InputOTP>
                  </FormControl>
                  <FormDescription>
                    This code will expire in 5 minutes
                  </FormDescription>
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
              {mutation.isPending ? "Verifying..." : "Verify"}
            </Button>
          </CardFooter>
        </form>
      </Form>
    </Card>
  );
}
