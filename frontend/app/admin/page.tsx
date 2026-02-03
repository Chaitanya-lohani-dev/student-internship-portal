"use client";
import Link from "next/link";

export default function admin() {
    
    return (
        <div className="max-w-full max-h-full flex justify-between">
            <button className="m-2 p-2 bg-green-600 hover:bg-green-800"><Link href="/jobs/new">Add new Job</Link></button>
            <button className="m-2 p-2 bg-green-600 hover:bg-green-800"><Link href="/admin/jobs">View Applications</Link></button>
        </div>
    )
}
