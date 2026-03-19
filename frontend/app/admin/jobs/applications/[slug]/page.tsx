'use client';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";

import { getAdminApplications, adminUpdateApplicationStatus } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Applications = {
  _id: string;
  userId: string;
  jobId: string;
  resume: string;
  createdAt: string;
  status: string;
};

export default function Page() {
  const [applications, setApplications] = useState<Applications[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [updateLoading, setUpdateLoading] = useState<string | null>(null);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  const [updateError, setUpdateError] = useState<string | null>(null);

  const router = useRouter();

  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const handleClick = async (newStatus: string, id: string) => {
    try {
      setUpdateLoading(id);
      setUpdateError(null);
      setUpdateStatus(null);

      if (!newStatus) {
        setUpdateError("Something went wrong!");
        return;
      }

      const res = await adminUpdateApplicationStatus(id, newStatus);

      if (res.status === 200) {
        setUpdateStatus("Application status updated successfully.");
        setApplications((prev) =>
          prev.map((app) =>
            app._id === id ? { ...app, status: newStatus } : app
          )
        );
      }
    } catch (error: unknown) {
      if (typeof error === "object" && error !== null && "response" in error) {
        const err = error as { response?: { status?: number } };
        if (err.response?.status === 401) {
          setUpdateError("Session expired. Please login again.");
        } else if (err.response?.status === 403) {
          setUpdateError("Unauthorized.");
        } else {
          setUpdateError("Unable to update application status. Please try again.");
        }
      }
    } finally {
      setUpdateLoading(null);
      setTimeout(() => {
        setUpdateStatus(null);
        setUpdateError(null);
      }, 2500);
    }
  };

  useEffect(() => {
    const fetchData = async (slugValue: string | string[] | undefined) => {
      try {
        const res = await getAdminApplications(slugValue as string);
        setApplications(res);
      } catch (error: unknown) {
        if (typeof error === "object" && error !== null && "response" in error) {
          const err = error as { response?: { status?: number } };
          if (err.response?.status === 401) {
            router.push("/login");
          } else if (err.response?.status === 403) {
            router.push("/student/jobs");
          } else {
            setError("Something went wrong while loading applications.");
          }
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData(slug);
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading applications...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto max-w-5xl px-4 py-8">
        <header className="mb-4">
          <h1 className="text-2xl font-semibold">Applications for this job</h1>
          <p className="text-sm text-muted-foreground">
            Review candidates and update their application status.
          </p>
        </header>

        {error && (
          <div className="mb-4">
            <Alert variant="error">{error}</Alert>
          </div>
        )}

        {!error && applications.length === 0 && (
          <Alert variant="info">No applications found for this job yet.</Alert>
        )}

        {updateStatus && (
          <div className="mb-3">
            <Alert variant="success">{updateStatus}</Alert>
          </div>
        )}
        {updateError && (
          <div className="mb-3">
            <Alert variant="error">{updateError}</Alert>
          </div>
        )}

        <div className="mt-4 space-y-3">
          {applications.map((application) => (
            <Card key={application._id} className="border">
              <CardHeader className="flex flex-row items-center justify-between space-y-0">
                <div>
                  <CardTitle className="text-base">
                    Candidate: <span className="font-mono text-xs">{application.userId}</span>
                  </CardTitle>
                  <CardDescription className="text-xs">
                    Job ID: {application.jobId}
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

              <CardContent className="space-y-2 text-xs text-muted-foreground">
                <p>
                  Applied on{" "}
                  <span className="font-medium">
                    {new Date(application.createdAt).toLocaleString()}
                  </span>
                </p>
                <p>
                  Resume:{" "}
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

              <CardFooter className="flex items-center justify-end gap-2">
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => handleClick("Selected", application._id)}
                  disabled={updateLoading === application._id}
                >
                  Mark as selected
                </Button>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  onClick={() => handleClick("Rejected", application._id)}
                  disabled={updateLoading === application._id}
                >
                  Mark as rejected
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </main>
    </div>
  );
}

