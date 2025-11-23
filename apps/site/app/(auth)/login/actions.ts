"use server";

import { compare } from "bcryptjs";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { findUserByEmail } from "@/lib/db";
import type { LoginFormState } from "./types.ts";

export async function loginAction(
  _prevState: LoginFormState,
  formData: FormData
): Promise<LoginFormState> {
  const email = formData.get("email");
  const password = formData.get("password");

  if (typeof email !== "string" || typeof password !== "string") {
    return {
      status: "error",
      message: "Credenciales inválidas. Vuelve a intentarlo.",
    };
  }

  if (!email.trim() || !password.trim()) {
    return {
      status: "error",
      message: "Debes completar el correo y la contraseña.",
    };
  }

  const user = await findUserByEmail(email.trim().toLowerCase());

  if (!user) {
    return {
      status: "error",
      message: "Las credenciales no coinciden con ningún usuario.",
    };
  }

  const validPassword = await compare(password, user.password_hash);

  if (!validPassword) {
    return {
      status: "error",
      message: "Las credenciales no coinciden con ningún usuario.",
    };
  }

  type MutableCookies = Awaited<ReturnType<typeof cookies>> & {
    set: (
      name: string,
      value: string,
      options?: Record<string, unknown>
    ) => void;
  };

  const cookieStore = (await cookies()) as MutableCookies;

  cookieStore.set("userId", user.id, {
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    maxAge: 60 * 60 * 24 * 7, // 7 días
  });

  redirect("/dashboard");
}
