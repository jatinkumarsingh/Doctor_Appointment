"use server";

import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";
import { db } from "@/lib/prisma";
import { clearAuthCookie, setAuthCookie, signAuthToken } from "@/lib/auth";

async function createSession(userId) {
  const token = signAuthToken({ userId });
  await setAuthCookie(token);
}

export async function signUpAction(_prevState, formData) {
  const name = formData.get("name")?.toString().trim();
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!name || !email || !password) {
    return { error: "All fields are required." };
  }

  if (password.length < 8) {
    return { error: "Password must be at least 8 characters long." };
  }

  const existingUser = await db.user.findUnique({ where: { email } });

  if (existingUser) {
    return { error: "Email is already registered." };
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const userId = crypto.randomUUID();

  const user = await db.user.create({
    data: {
      id: userId,
      clerkUserId: userId,
      name,
      email,
      passwordHash,
      transactions: {
        create: {
          type: "CREDIT_PURCHASE",
          packageId: "free_user",
          amount: 0,
        },
      },
    },
  });

  await createSession(user.id);
  redirect("/onboarding");
}

export async function signInAction(_prevState, formData) {
  const email = formData.get("email")?.toString().trim().toLowerCase();
  const password = formData.get("password")?.toString();

  if (!email || !password) {
    return { error: "Email and password are required." };
  }

  const user = await db.user.findUnique({ where: { email } });

  if (!user?.passwordHash) {
    return { error: "Invalid email or password." };
  }

  const isValidPassword = await bcrypt.compare(password, user.passwordHash);

  if (!isValidPassword) {
    return { error: "Invalid email or password." };
  }

  await createSession(user.id);

  if (user.role === "ADMIN") {
    redirect("/admin");
  }

  if (user.role === "DOCTOR") {
    if (user.verificationStatus === "VERIFIED") {
      redirect("/doctor");
    }

    redirect("/doctor/verification");
  }

  if (user.role === "PATIENT") {
    redirect("/doctors");
  }

  redirect("/onboarding");
}

export async function signOutAction() {
  await clearAuthCookie();
  redirect("/sign-in");
}