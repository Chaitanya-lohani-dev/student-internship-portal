"use client";
import { useState, useEffect } from "react";
import { getStudentApplicationsAPI, delApplicationAPI } from "@/lib/api";
import JobListSkeleton from "@/components/JobListSkeleton";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Application = {
  _id: string;
  jobId: string;
  resume: string;
  createdAt: string;
  status: string;
};

export default function StudentApplicationsPage() {
  const [loading, setLoading] = useState(true);
  const [applications, setApplications] = useState<Application[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [delStatus, setDelStatus] = useState<string | null>(null);
  const [delError, setDelError] = useState<string | null>(null);

  const handleDelete = async (
    e: React.MouseEvent<HTMLButtonElement>,
    id: string
  ) => {

    if (!window.confirm("Are you sure you want to delete this application?")) {
      return;
    }

    try {
      const res = await delApplicationAPI(id);
      if (res.status === 200) {
        setApplications((prev) => prev.filter((app) => app._id !== id));
        setDelStatus("Application deleted successfully.");
        setTimeout(() => setDelStatus(null), 2000);
      }
    } catch (error) {
      console.error(error);
      setDelError("Failed to delete application. Please try again.");
      setTimeout(() => setDelError(null), 2000);
    }
  };

  useEffect(() => {
    const getApplications = async () => {
      try {
        const applications = await getStudentApplicationsAPI();
        setApplications(applications);
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "response" in error) {
          const err = error as { response?: { status?: number } };
          if (err.response?.status === 429) {
            setError("Too many requests, try again later.");
          } else if (err.response?.status === 401) {
            setError("Session expired. Please login again.");
          } else {
            setError("Failed to load applications. Please try again.");
          }
        }
      } finally {
        setLoading(false);
      };
    };

    getApplications();
  }, []);

  if (loading) return <JobListSkeleton />;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="mx-auto max-w-4xl px-4 py-8">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">My applications</h1>
          <p className="text-sm text-muted-foreground">
            Track the status of the internships you&apos;ve applied for.
          </p>
        </header>

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {!error && applications.length === 0 && (
          <Alert variant="info">You haven&apos;t applied to any jobs yet.</Alert>
        )}

        {delStatus && (
          <div className="mb-3">
            <Alert variant="success">{delStatus}</Alert>
          </div>
        )}
        {delError && (
          <div className="mb-3">
            <Alert variant="error">{delError}</Alert>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {applications.map((application) => (
            <Card key={application._id} className="border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base font-semibold">
                    Job ID: {application.jobId}
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Applied on {new Date(application.createdAt).toLocaleString()}
                  </CardDescription>
                </div>
                <Badge
                  variant={
                    application.status === "Selected"
                      ? "success"
                      : application.status === "Rejected"
                        ? "destructive"
                        : "default"
                  }
                >
                  {application.status}
                </Badge>
              </CardHeader>

              <CardContent className="space-y-1 text-xs text-muted-foreground">
                <p className="truncate">
                  Resume URL:{" "}
                  <a
                    href={application.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary underline"
                  >
                    Open resume
                  </a>
                </p>
              </CardContent>

              <CardFooter className="flex justify-end">
                <Button
                  variant="destructive"
                  size="sm"
                  onClick={(e) => handleDelete(e, application._id)}
                >
                  Delete application
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

