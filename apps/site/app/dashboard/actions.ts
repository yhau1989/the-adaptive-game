"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

type MutableCookies = Awaited<ReturnType<typeof cookies>> & {
  delete: (name: string, options?: Record<string, unknown>) => void;
};

export async function logoutAction(): Promise<void> {
  const cookieStore = (await cookies()) as MutableCookies;

  cookieStore.delete("userId", { path: "/" });

  redirect("/login");
}
