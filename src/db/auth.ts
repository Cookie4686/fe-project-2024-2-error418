"use server";

import { AuthError } from "next-auth";
import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { z } from "zod";
import User, { UserDB, UserJSON } from "./models/User";
import dbConnect from "./dbConnect";
import { signIn, signOut } from "@/auth";
import { RootFilterQuery } from "mongoose";
import { QueryOptions } from "mongoose";
import { clearUserObjectID } from "./models/utils";

export async function authenticateUser(email: string, password: string) {
  await dbConnect();
  try {
    const user = await User.findOne({ email }).select("+password");
    if (user && (await bcrypt.compare(password, user.password))) {
      return user;
    }
  } catch (err) {
    console.error(err);
  }
  return null;
}

const RegisterForm = z.object({
  name: z.string().min(2, { message: "Name must be at least 2 characters" }).trim(),
  phone: z.string().trim(),
  email: z.string().email({ message: "Please enter a valid email" }),
  password: z.string().min(6, { message: "Password length must be at least 6" }).trim(),
});

export async function registerUser(formState: unknown, formData: FormData) {
  const searchParams = new URL(formData.get("callbackUrl")?.toString() || "", "http://localhost")
    .searchParams;
  const returnTo = searchParams.get("returnTo") || "/";
  const validatedFields = RegisterForm.safeParse({
    name: formData.get("name"),
    phone: formData.get("phone"),
    email: formData.get("email"),
    password: formData.get("password"),
  });

  if (validatedFields.success) {
    await dbConnect();
    const { name, phone, email, password } = validatedFields.data;
    const user = await User.insertOne({ name, phone, email, password });
    if (user) {
      await signIn("credentials", {
        ...Object.fromEntries(formData),
        redirect: false, // Prevent next-auth from handling the redirect
      });
      return redirect(returnTo);
    }
  } else {
    console.log("register failed");
    return { success: false, errors: validatedFields.error.flatten() };
  }
  return { success: false };
}

export async function loginUser(formState: unknown, formData: FormData) {
  try {
    const searchParams = new URL(formData.get("callbackUrl")?.toString() || "", "http://localhost")
      .searchParams;
    const returnTo = searchParams.get("returnTo") || "/";
    await signIn("credentials", {
      ...Object.fromEntries(formData),
      redirect: false, // Prevent next-auth from handling the redirect
    });
    return redirect(returnTo);
  } catch (error) {
    if (error instanceof AuthError) {
      const searchParams = new URL(
        formData.get("callbackUrl")?.toString() || "",
        "http://localhost"
      ).searchParams;
      const returnTo = searchParams.get("returnTo") || "";
      const returnToParam = returnTo ? `&returnTo=${encodeURIComponent(returnTo)}` : "";

      return redirect(`/login?error=${error.type}${returnToParam}`);
    }
    throw error;
  }
}

export async function logoutUser() {
  await signOut();
}

export async function getUserData(
  id: string
): Promise<{ success: true; data: UserDB } | { success: false }> {
  await dbConnect();
  try {
    const result = await User.findById(id);
    if (result) {
      return { success: true, data: result };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}

export async function getUserList(
  filter: RootFilterQuery<UserDB> = {},
  options: QueryOptions<UserDB> = {}
): Promise<{ success: true; count: number; data: UserJSON[] } | { success: false }> {
  await dbConnect();
  try {
    const users = await User.find(filter, undefined, options).lean();
    if (users) {
      return {
        success: true,
        count: users.length,
        data: users.map((e) => clearUserObjectID(e) as UserJSON),
      };
    }
  } catch (err) {
    console.error(err);
  }
  return { success: false };
}
