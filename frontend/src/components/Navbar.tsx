"use client";

import Link from "next/link";
import { useSession, signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ShinyButton from "./ui/shiny-button";
import ShimmerButton from "./ui/shimmer-button";

export function Navbar() {
  const { data: session } = useSession();

  return (
    <nav className="bg-white border-b border-gray-200">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-2xl font-bold text-gray-900">
            Blog Platform
          </Link>
          <div className="flex items-center space-x-4">
            {session ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-gray-700 hover:text-gray-900">
                  Dashboard
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarFallback>
                          {session.user?.email?.[0].toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => signOut()}>
                      Log out
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Link href="/login">
                  <ShinyButton text="Log in" />
                </Link>
                <Link href="/signup">
                  <ShimmerButton className="shadow-2xl py-2">
                    Sign Up
                  </ShimmerButton>
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
