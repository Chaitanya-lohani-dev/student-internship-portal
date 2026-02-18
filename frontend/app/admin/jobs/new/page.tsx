'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { z } from "zod";

import { adminCreateJob, getAdminJobs, updateAdminJob } from "@/lib/api";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Alert } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";

type Jobs = {
  _id: string;
  title: string;
  description: string;
  closesAt: string;
  applicationCount: string;
};

const jobSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(200),
  closesAt: z.string(),
});

export default function Page() {
  const [jobSubmit, setJobSubmit] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createState, setCreateState] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    title: "",
    description: "",
    closesAt: "",
  });
  const [editingId, setEditingId] = useState<string | null>(null);

  const router = useRouter();

  const handleEdit = (job: Jobs) => {
    setForm({
      title: job.title,
      description: job.description,
      closesAt: job.closesAt.slice(0, 16),
    });
    setEditingId(job._id);
    setCreateState(null);
    setSubmitError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSubmitError(null);
    setCreateState(null);

    try {
      setJobSubmit(true);
      const formData = new FormData(e.currentTarget);
      const data = Object.fromEntries(formData.entries());
      const validation = jobSchema.safeParse(data);

      if (!validation.success) {
        setSubmitError("Please provide a title (min 10 chars) and description (min 200 chars).");
        return;
      }

      const { title, description, closesAt } = validation.data;

      if (editingId) {
        const res = await updateAdminJob(editingId, title, description, closesAt);
        if (res.status === 200) {
          setCreateState("Job updated successfully.");
          const refreshed = await getAdminJobs();
          setJobs(refreshed.data.data);
        }
      } else {
        const res = await adminCreateJob(title, description, closesAt);
        if (res.status === 201) {
          setCreateState("Job created successfully.");
          const refreshed = await getAdminJobs();
          setJobs(refreshed.data.data);
        }
      }
    } catch (error: any) {
      if (error?.response?.status === 400) {
        setError("Unable to update job. Please check the details and try again.");
      } else if (error?.response?.status === 401) {
        setError("Session expired. Redirecting to login...");
        setTimeout(() => router.push("/login"), 1000);
      } else if (error?.response?.status === 403) {
        setError("Unauthorized. Redirecting to student jobs...");
        setTimeout(() => router.push("/student/jobs"), 1000);
      } else {
        setError("Some error occurred while processing your request.");
      }
    } finally {
      setJobSubmit(false);
    }

    setForm({
      title: "",
      description: "",
      closesAt: "",
    });
    setEditingId(null);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminJobs();
        setJobs(res.data.data);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          setError("Session expired.");
          setTimeout(() => router.push("/login"), 1000);
        } else if (error?.response?.status === 403) {
          setError("Unauthorized.");
          setTimeout(() => router.push("/student/jobs"), 1000);
        } else {
          setError("Some error occurred while processing request.");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [router]);

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <span className="text-sm text-muted-foreground">Loading jobs...</span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <main className="mx-auto flex max-w-5xl flex-col gap-6 px-4 py-8 md:flex-row">
        <section className="w-full md:w-2/5">
          <Card className="shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">
                {editingId ? "Edit job" : "Create a new job"}
              </CardTitle>
              <CardDescription className="text-xs">
                Provide clear, detailed information so students can understand the opportunity.
              </CardDescription>
            </CardHeader>

            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label htmlFor="title" className="flex items-center text-sm font-medium">
                    <span>Title</span>
                    <span className="ml-1 text-destructive">*</span>
                  </label>
                  <Input
                    name="title"
                    id="title"
                    type="text"
                    placeholder="e.g. Backend Intern - Summer 2026"
                    value={form.title}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, title: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="description"
                    className="flex items-center text-sm font-medium"
                  >
                    <span>Description</span>
                    <span className="ml-1 text-destructive">*</span>
                  </label>
                  <Textarea
                    name="description"
                    id="description"
                    placeholder="Describe the role, responsibilities, and what you are looking for in a candidate."
                    value={form.description}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                  />
                </div>

                <div className="space-y-1">
                  <label
                    htmlFor="closesAt"
                    className="flex items-center text-sm font-medium"
                  >
                    <span>Application deadline</span>
                    <span className="ml-1 text-destructive">*</span>
                  </label>
                  <Input
                    name="closesAt"
                    id="closesAt"
                    type="datetime-local"
                    placeholder="Select closing date and time"
                    value={form.closesAt}
                    onChange={(e) =>
                      setForm((prev) => ({ ...prev, closesAt: e.target.value }))
                    }
                  />
                </div>

                {submitError && (
                  <Alert variant="error">{submitError}</Alert>
                )}

                {createState && !submitError && (
                  <Alert variant="success">{createState}</Alert>
                )}

                <Button type="submit" className="w-full" disabled={jobSubmit}>
                  {jobSubmit
                    ? editingId
                      ? "Updating job..."
                      : "Creating job..."
                    : editingId
                    ? "Update job"
                    : "Add job"}
                </Button>
              </form>
            </CardContent>
          </Card>

          {error && (
            <div className="mt-4">
              <Alert variant="error">{error}</Alert>
            </div>
          )}
        </section>

        <section className="w-full md:w-3/5">
          <Card className="h-full shadow-sm">
            <CardHeader>
              <CardTitle className="text-lg">Current jobs</CardTitle>
              <CardDescription className="text-xs">
                Edit an existing job by selecting it from the list.
              </CardDescription>
            </CardHeader>

            <CardContent className="space-y-3">
              {jobs.length === 0 && (
                <Alert variant="info">
                  You haven&apos;t created any jobs yet.
                </Alert>
              )}

              {jobs.map((job) => (
                <Card
                  key={job._id}
                  className="cursor-pointer border border-border/80 transition hover:border-primary/40"
                  onClick={() => handleEdit(job)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-base">{job.title}</CardTitle>
                      <Badge variant="outline" className="text-[10px]">
                        {job.applicationCount} applications
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="space-y-1 text-xs text-muted-foreground">
                    <p className="line-clamp-2">{job.description}</p>
                    <p>
                      Closes on{" "}
                      <span className="font-medium">
                        {job.closesAt.slice(0, 10)}
                      </span>
                    </p>
                  </CardContent>
                </Card>
              ))}
            </CardContent>

            <CardFooter />
          </Card>
        </section>
      </main>
    </div>
  );
}

