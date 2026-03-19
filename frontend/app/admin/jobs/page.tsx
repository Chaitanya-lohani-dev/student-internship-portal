'use client';
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getAdminJobs } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Jobs = {
  _id: string;
  title: string;
  description: string;
  applicationCount: number;
};

export default function JobsPage() {
  const [data, setData] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/admin/jobs/applications/${id}`);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const jobs = await getAdminJobs();
        setData(jobs);
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "response" in error) {
          const err = error as { response?: { status?: number } };
          if (err.response?.status === 401) {
            router.push("/login");
          } else if (err.response?.status === 403) {
            setError("Forbidden. You are not allowed to view these jobs.");
            setTimeout(() => router.push("/student/jobs"), 400);
          } else {
            setError("Something went wrong while loading jobs.");
            console.error(error);
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  },[]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Jobs you manage</h1>
            <p className="text-sm text-muted-foreground">
              View your postings and see how many applications each has received.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {data.length} job{data.length === 1 ? "" : "s"}
          </Badge>
        </header>

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {!error && data.length === 0 && (
          <Alert variant="info">No jobs found. Create a job to get started.</Alert>
        )}

        <div className="mt-4 space-y-3">
          {data.map((job) => (
            <Card
              key={job._id}
              className="cursor-pointer transition hover:border-primary/40 hover:shadow-sm"
              onClick={() => handleClick(job._id)}
            >
              <CardHeader>
                <CardTitle className="text-lg">{job.title}</CardTitle>
                <CardDescription className="line-clamp-2 text-sm">
                  {job.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Applications received:{" "}
                  <span className="font-medium">{job.applicationCount}</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <span className="text-sm font-medium text-primary">
                  View applications →
                </span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

