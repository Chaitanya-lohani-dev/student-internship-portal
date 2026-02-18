"use client";
import Link from "next/link";

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-4xl flex-col items-center justify-center px-4 py-12">
        <Card className="w-full max-w-xl shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">Admin dashboard</CardTitle>
            <CardDescription className="text-sm">
              Create and manage internship postings, and review applications from students.
            </CardDescription>
          </CardHeader>
          <CardContent className="mt-2 flex flex-col gap-3 sm:flex-row sm:justify-between">
            <Button asChild className="w-full sm:w-auto">
              <Link href="/admin/jobs/new">Create new job</Link>
            </Button>
            <Button asChild variant="outline" className="w-full sm:w-auto">
              <Link href="/admin/jobs">Manage jobs & applications</Link>
            </Button>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

