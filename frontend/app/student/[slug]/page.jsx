"use client";
import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

import { getStudentJob, submitApplication } from "@/lib/api";
import { useEdgeStore } from "@/lib/edgestore";
import Navbar from "@/components/Navbar";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";

export default function StudentJobPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { edgestore } = useEdgeStore();
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState(null);
  const [statusError, setStatusError] = useState(null);

  const params = useParams();
  const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;

  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatusMessage(null);
    setStatusError(null);

    try {
      if (!file) {
        setStatusError("Please upload your resume before submitting.");
        return;
      }

      const resumeUrl = await edgestore.publicFiles.upload({
        file,
        onProgressChange: (progress) => {
          setUploadProgress(progress);
        },
      });

      const res = await submitApplication(slug, resumeUrl.url);

      if (res.status === 201) {
        setStatusMessage("Successfully submitted the application.");
      }
    } catch (error) {
      if (error.response?.status === 409) {
        setStatusError("You have already applied for this job.");
      } else {
        setStatusError("Something went wrong while submitting. Please try again.");
      }
    } finally {
      setTimeout(() => {
        setStatusMessage(null);
        setStatusError(null);
      }, 2500);
    }
  };

  useEffect(() => {
    const fetchData = async (slugValue) => {
      try {
        if (!slugValue) {
          setError("Something went wrong. Redirecting to job list...");
          setTimeout(() => router.push("/student/jobs"), 500);
          return;
        }

        const jobData = await getStudentJob(slugValue);
        if (jobData) {
          setData(jobData);
        } else {
          setError("Unable to load this job. Please try again.");
        }
      } catch (error) {
        if (error.response?.status === 401) {
          setError("Session expired. Redirecting to login...");
          setTimeout(() => router.push("/login"), 500);
        } else if (error.response?.status === 429) {
          setError("Too many requests. Please try again after some time.");
        } else if (error.response?.status === 404) {
          setError("This job is no longer available.");
        } else {
          setError("Could not load the job details. Please try again.");
        }
      } finally {
        setLoading(false);
        setFile(null);
        setUploadProgress(0);
      }
    };

    fetchData(slug);
  }, [slug, router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading job details...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-screen items-center justify-center px-4">
        <Alert variant="error">{error}</Alert>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      <main className="mx-auto max-w-4xl px-4 py-8">
        <Card className="shadow-sm">
          <CardHeader>
            <CardTitle className="text-2xl">{data.title}</CardTitle>
            <CardDescription className="space-y-1 text-sm">
              <p>{data.description}</p>
              <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>
                  Closes on <span className="font-medium">{data.closesAt.slice(0, 10)}</span> at{" "}
                  <span className="font-medium">{data.closesAt.slice(11, 16)}</span>
                </span>
                {data?.lastUpdated && (
                  <span>
                    Last updated on{" "}
                    <span className="font-medium">{data.lastUpdated.slice(0, 10)}</span> at{" "}
                    <span className="font-medium">{data.lastUpdated.slice(11, 16)}</span>
                  </span>
                )}
              </div>
            </CardDescription>
          </CardHeader>

          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="resume"
                  className="block text-sm font-medium text-foreground"
                >
                  Upload resume (PDF)
                </label>
                <input
                  className="block w-full rounded-md border border-input bg-background text-sm file:mr-4 file:rounded-md file:border-0 file:bg-primary file:px-3 file:py-1.5 file:text-sm file:font-medium file:text-primary-foreground hover:file:bg-primary/90"
                  type="file"
                  name="resume"
                  id="resume"
                  accept=".pdf"
                  onChange={(e) => {
                    const nextFile = e.target.files?.[0] ?? null;
                    setFile(nextFile);
                  }}
                />
              </div>

              {uploadProgress > 0 && (
                <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                  <div
                    className="h-full bg-primary transition-all"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {statusMessage && (
                <Alert variant="success">
                  {statusMessage}
                </Alert>
              )}

              {statusError && (
                <Alert variant="error">
                  {statusError}
                </Alert>
              )}

              <div className="flex justify-end gap-2 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => router.push("/student/jobs")}
                >
                  Back to jobs
                </Button>
                <Button
                  type="submit"
                  disabled={uploadProgress > 0 && uploadProgress < 100}
                >
                  {uploadProgress > 0 && uploadProgress < 100
                    ? "Submitting..."
                    : "Submit application"}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}

