"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-gray-800 text-white p-4">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Blog Platform
        </Link>
        <div>
          {session ? (
            <>
              <Link href="/dashboard" className="mr-4">
                Dashboard
              </Link>
              <Button onClick={() => signOut()}>Log out</Button>
            </>
          ) : (
            <>
              <Link href="/login">
                <Button>Log in</Button>
              </Link>

              <Link href="/signup">
                <Button variant="outline" className="text-black">
                  Sign Up
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
