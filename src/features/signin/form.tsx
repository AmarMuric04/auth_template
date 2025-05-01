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
import axios from "axios";
import { useRouter } from "next/navigation";
import { useOTPStore } from "@/store/use-otp-store";

const formSchema = z.object({
  email: z.string().email({ message: "Please enter a valid email" }),
});

export default function SignInForm(): React.JSX.Element {
  const router = useRouter();
  const { setEmail } = useOTPStore();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    axios.post("/api/otp/send_otp", JSON.stringify({ email: values.email }));
    setEmail(values.email);

    router.push("/otp");
  }

  return (
    <Card className="w-[450px]">
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
            <Button className="w-full" type="submit">
              Submit
            </Button>
          </CardFooter>
        </form>
      </Form>
      <p className="text-center">
        Don&#39;t have an account? <Link href="/signup">Create one!</Link>
      </p>
    </Card>
  );
}
