"use client";
import { useState, useEffect } from "react";
import { getStudentApplicationsAPI, delApplicationAPI } from "@/app/lib/api";

type Application = {
  _id: string;
  jobId: string;
  resume: string;
  appliedAt: string;
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
    e.preventDefault();
    try {
      const res = await delApplicationAPI(id);
      if (res.status === 200) {
        setApplications(prev => prev.filter(app => app._id !== id));
        setDelStatus("Application deleted successfully");
        setTimeout(() => setDelStatus(null), 2000);
      }
    } catch (error){
      console.log(error)
      setDelError("Failed to delete application");
      setTimeout(() => setDelError(null), 2000);
    }
  };

  useEffect(() => {
    const getApplications = async () => {
      try {
        const res = await getStudentApplicationsAPI();
        setApplications(res.applications);
      } catch (error: any) {
        if (error.response?.status === 429) {
          setError("Too many requests, try again later");
        } else {
          setError("Failed to load applications");
        }
      } finally {
        setLoading(false);
      }
    };
    getApplications();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="bg-red-600 text-white">{error}</div>;

  return (
    <div>
      {applications.length === 0 && <div>No applications found</div>}

      {applications.map(application => (
        <div key={application._id} className="border p-2 m-2">
          <div>{application.jobId}</div>
          <div>{application.resume}</div>
          <div>{application.appliedAt}</div>
          <div>{application.status}</div>

          <button
            className="bg-red-600 text-white p-2 mt-2"
            onClick={(e) => handleDelete(e, application._id)}
          >
            Delete
          </button>
        </div>
      ))}

      {delStatus && <div className="bg-green-600 text-white">{delStatus}</div>}
      {delError && <div className="bg-red-600 text-white">{delError}</div>}
    </div>
  );
}
