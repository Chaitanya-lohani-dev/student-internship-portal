'use client';
import { useRouter } from "next/navigation"
import { useEffect } from "react";

export default function page() {
  const router = useRouter();

  useEffect(() => {
    setTimeout(() => router.push('/student/jobs'),200)
  },[])
  
  return (
    <div>
      
    </div>
  )
}
