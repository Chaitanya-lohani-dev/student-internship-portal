"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { getStudentJobs } from "@/lib/api";
import Navbar from "@/components/Navbar";
import JobListSkeleton from "@/components/JobListSkeleton";
import { Card, CardHeader, CardTitle, CardContent, CardFooter, CardDescription } from "@/components/ui/card";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Job = {
  _id: string;
  title: string;
  description: string;
  applicationCount: number;
};

export default function StudentJobs() {
  const [data, setData] = useState<Job[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  const handleClick = (id: string) => {
    router.push(`/student/${id}`);
  };

  useEffect(() => {
    const fetchdata = async () => {
      try {
        const jobsData = await getStudentJobs();

        if (jobsData) {
          setData(jobsData);
        } else {
          setError("Error loading jobs. Please try again.");
        }
      } catch (error: unknown) {
        const status =
          typeof error === "object" &&
          error !== null &&
          "response" in error &&
          typeof (error as { response?: { status?: number } }).response?.status === "number"
            ? (error as { response?: { status?: number } }).response?.status
            : undefined;

        if (status === 429) {
          setError("Too many requests. Try again after some time.");
        } else if (status === 401) {
          setError("Session expired. Redirecting to login...");
          setTimeout(() => router.push("/login"), 400);
        } else {
          setError("Failed to load jobs. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchdata();
  }, []);

  if (loading) {
    return <JobListSkeleton />;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-5xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold">Available internships</h1>
            <p className="text-sm text-muted-foreground">
              Browse open positions and apply with your latest resume.
            </p>
          </div>
          <Badge variant="outline" className="text-xs">
            {data.length} open {data.length === 1 ? "role" : "roles"}
          </Badge>
        </div>

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {!error && data.length === 0 && (
          <Alert variant="info">No jobs available right now. Please check back later.</Alert>
        )}

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          {data.map((job) => (
            <Card
              key={job._id}
              className="cursor-pointer transition hover:border-primary/40 hover:shadow-md"
              onClick={() => handleClick(job._id)}
            >
              <CardHeader>
                <CardTitle className="line-clamp-1 text-lg">{job.title}</CardTitle>
                <CardDescription className="line-clamp-2">
                  {job.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-xs text-muted-foreground">
                  Applications received: <span className="font-medium">{job.applicationCount}</span>
                </p>
              </CardContent>
              <CardFooter className="flex justify-end">
                <span className="text-sm font-medium text-primary">View details →</span>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

