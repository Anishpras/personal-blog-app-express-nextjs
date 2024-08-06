"use client";

import { Suspense, useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ClientErrorBoundary from "@/components/ClientErrorBoundary";
import ErrorFallback from "@/components/ErrorFallback";
import { Loading } from "@/components/Loading";
import { toast } from "sonner";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (result?.error) {
      console.error("Failed to log in:", result.error);
      toast("Failed to log in. Please check email and password.", {
        style: {
          backgroundColor: "red",
          color: "white",
        },
      });
    } else {
      toast("Logged in successfully");
      router.push("/dashboard");
    }
  };

  return (
    <ClientErrorBoundary fallback={<ErrorFallback />}>
      <Suspense fallback={<Loading />}>
        <div className="container mx-auto mt-8 max-w-md">
          <h1 className="text-3xl font-bold mb-4">Log In</h1>
          <form onSubmit={handleSubmit} className="space-y-4">
            <Input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="w-full">
              Log In
            </Button>
          </form>
        </div>
      </Suspense>
    </ClientErrorBoundary>
  );
}
