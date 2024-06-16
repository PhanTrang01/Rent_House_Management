"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const username = localStorage.getItem("username");
    if (username) router.push("/homepage");
    router.push("/login");
  }, [router]);

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      HomePage
    </main>
  );
}
