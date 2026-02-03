'use client';
import { getAdminJobs } from "@/app/lib/api";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Jobs = {
  _id: string,
  title: string,
  description: string,
  applicationCount: number
}

export default function JobsPage() {
  const [data, setData] = useState<Jobs[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  
  const router = useRouter();

  const handleClick = async(e : any, id: string) => {
    e.preventDefault();
    router.push(`/admin/jobs/applications/${id}`); 
  }

  useEffect(() => {
    const fetchData = async() => {
      try {
        const res = await getAdminJobs();
        const jobs = res.data.data;
        setData(jobs);
      } catch (error: any) {
        if (error?.response?.status === 401) {
          router.push('/login');
        }else if (error?.response?.status === 403) {
          setError("Forbiden...")
          setTimeout(() => router.push('/jobs'), 200)
        } else {
          setError("Some error Occur");
          console.log(error)
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  },[])
  
  if (loading) return <div>Loading...</div>

  return (
    <div className="m-0 p-0">
      <div>
        {error && <div className={error ? "bg-red-600 text-white": 'invisible'}>{error}</div>}
        
        {data.length === 0 && !error  && (
          <div className={data.length === 0 ? '' : 'invisible'}>No Jobs Found</div>
        )}

        {data.map(job => (
          <div key={job._id} onClick={(e) => handleClick(e, job._id)} className="p-2 m-2 flex flex-col max-w-full border-2">
            <div className="text-2xl font-bold">{job.title}</div>
            <div className="text-3xl font-bold">{job.description.slice(0,120) + "..."}</div>
            <div className="font-bold text-sm">{job.applicationCount}</div>
          </div>
        ))}
      </div>
    </div>
  )
}
