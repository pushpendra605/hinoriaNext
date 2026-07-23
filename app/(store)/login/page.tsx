import type { Metadata } from "next";
import LoginClient from "./LoginClient";
export const metadata: Metadata = { title: "Login / Register" };

export default async function LoginPage({
  searchParams,
}: {
  searchParams: Promise<{ tab?: string }>;
}) {
  const params = await searchParams;

  return (
    <LoginClient
      defaultTab={params.tab === "register" ? "register" : "login"}
    />
  );
}
