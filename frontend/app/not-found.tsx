'use client';
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function custon404() {
    const router = useRouter();

    useEffect(() => {
        setTimeout(() => router.push('/student/jobs'), 200);
    },[])
  return (
    <div>
      <h1>Job Not found - Pelease try later</h1>
      <p>Redirecting to jobs page....</p>
    </div>
  )
}
