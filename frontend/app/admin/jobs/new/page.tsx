'use client';
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { adminCreateJob, getAdminJobs, updateAdminJob } from '@/app/lib/api';
import { z } from 'zod';

type Jobs = {
  _id: string,
  title: string,
  description: string,
  closesAt: string,
  applicationCount: string
}

const jobSchema = z.object({
  title: z.string().min(10),
  description: z.string().min(200),
  closesAt: z.string(),
})

export default function page() {
  const [jobSubmit, setJobSubmit] = useState<boolean>(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [createState, setCreateState] = useState<string | null>(null);
  const [jobs, setJobs] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [editButton, setEditButton] = useState<boolean>(false);
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

    setEditButton(true);
  };

  const handelSubmit = async (e: any) => {
    try {
      setJobSubmit(true);
      e.preventDefault();
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const validation = jobSchema.safeParse(data);

      if (!validation.success) {
        setSubmitError("Please input valid data");
        setJobSubmit(false);
        return;
      }

      const { title, description, closesAt } = validation.data

      if(editingId) {
        const res = await updateAdminJob(editingId, title, description, closesAt);
        if (res.status === 200) {
          setCreateState("Job Updated Successfully")
        }
      } else {
        const res = await adminCreateJob(title, description, closesAt);
        if (res.status === 201) {
          setCreateState("Job Created Successfully")
        }
      }

    } catch (error: any) {
      if (error?.response?.status === 400) {
        setError("Unable to update job")
      } else if (error?.response?.status === 401) {
        setError("Session expired")
        setTimeout(() => router.push("/login"), 1000)
      } else if (error?.response?.status === 403) {
        setError("unauthorized")
        setTimeout(() => router.push('/student/jobs'), 1000)
      } else {
        setError("Some Error Occured")
      }
    } finally {
      setJobSubmit(false);
      setForm({
        title: "",
        description: "",
        closesAt: "",
      });

      setEditingId(null);
    }
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await getAdminJobs();
        setJobs(res.data.data);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          setError("Session expired.")
          setTimeout(() => router.push("/login"), 1000)
        } else if (error?.response?.status === 403) {
          setError("Unauthorized.")
          setTimeout(() => router.push('/student/jobs'), 1000)
        } else {
          setError("Some error occured while prcessing requeest")
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>
  if (error) return <div>{error}</div>

  return (
    <div className="m-0 p-0 max-w-full max-h-full">
      <form onSubmit={(e) => handelSubmit(e)} className="flex flex-col border-2 p-2 m-2 justify-items-center w-lvw">
        <div className="flex flex-row">
          <label>Title</label>
          <p className="text-red-500"> *</p>
        </div>
        <input name='title' id="title" type="text" placeholder="Enter Title" className="border-2" value={form.title}
          onChange={(e) =>
            setForm(prev => ({ ...prev, title: e.target.value }))
          } />
        <div className="flex flex-row">
          <label>Description</label>
          <p className="text-red-500">*</p>
        </div>
        <input name='description' id="description" type="text" placeholder="Enter Description" className="border-2" value={form.description}
          onChange={(e) =>
            setForm(prev => ({ ...prev, description: e.target.value }))
          } />
        <div className="flex flex-row">
          <label>Date</label>
          <p className="text-red-500">*</p>
        </div>
        <input name='closesAt' id="closesAt" type="datetime-local" placeholder="Enter Date" className="border-2" value={form.closesAt}
          onChange={(e) =>
            setForm(prev => ({ ...prev, closesAt: e.target.value }))
          } />
        <button type="submit" className="bg-green-500 m-2 p-2 justify-center hover:bg-green-700" disabled={jobSubmit}>{editingId ? "Update Job": "Add Job"}</button>
      </form>
      {submitError && <div className={submitError ? "bg-red-500 text-white" : 'invisible'}>{submitError}</div>}

      {createState && !submitError && (<div className={createState ? 'bg-green-600 text-white' : 'invisible'}>{createState}</div>)}

      <div>
        <div className="gap-y-3">
          {jobs.map(job => (
            <div key={job._id} className="m-2 p-2 border-2">
              <div>{job.title}</div>
              <div>{job.description}</div>
              <div className="flex flex-row">
                <div>{job.applicationCount}</div>
                <div>{job.closesAt.slice(0, 9)}</div>
              </div>
              <button type="button" onClick={() => handleEdit(job)}>Edit</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
