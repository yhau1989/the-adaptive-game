import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export default async function Home() {
  const cookieStore = await cookies();
  const isLoggedIn = Boolean(cookieStore.get("userId")?.value);

  redirect(isLoggedIn ? "/dashboard" : "/login");
}
