import React from "react";
import { Button } from "./ui/button";
import {
  Calendar,
  Stethoscope,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { getAuthUserId } from "@/lib/auth";
import { signOutAction } from "@/actions/auth";

export default async function Header() {
  const userId = await getAuthUserId();

  return (
    <header className="fixed top-0 w-full border-b bg-background/80 backdrop-blur-md z-10 supports-[backdrop-filter]:bg-background/60">
      <nav className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 cursor-pointer">
          <Image
            src="/logo-single.png"
            alt="Medimeet Logo"
            width={200}
            height={60}
            className="h-10 w-auto object-contain"
          />
        </Link>

        {/* Action Buttons */}
        <div className="flex items-center space-x-2">
          <Link href="/doctors">
            <Button
              variant="outline"
              className="hidden md:inline-flex items-center gap-2"
            >
              <Stethoscope className="h-4 w-4" />
              Find Doctors
            </Button>
          </Link>
          <Link href="/appointments">
            <Button
              variant="outline"
              className="hidden md:inline-flex items-center gap-2"
            >
              <Calendar className="h-4 w-4" />
              Appointments
            </Button>
          </Link>

          {userId ? (
            <form action={signOutAction}>
              <Button type="submit">Sign Out</Button>
            </form>
          ) : (
            <Link href="/sign-in">
              <Button>Sign In</Button>
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
