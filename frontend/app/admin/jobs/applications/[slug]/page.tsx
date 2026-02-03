'use client';
import { useEffect, useState } from "react";
import { useRouter, useParams  } from "next/navigation";
import { getAdminApplications } from '@/app/lib/api';

type Appliactions = {
    _id: string,
    userId: string,
    jobId: string,
    resume: string,
    appliedAt: string,
    status: string
}

export default function page() {
    const [applications, setApplications] = useState<Appliactions[]>([]);
    const [loading,setLoading] = useState<boolean>(true);
    const [error,setError] = useState<string | null>(null)
    
    const router = useRouter();

    const params = useParams();
    const slug = Array.isArray(params.slug)
        ? params.slug[0]
        : params.slug;
    
    
    useEffect(() => {
        const fetchData = async(slug: any) => {
            try {
                const res = await getAdminApplications(slug);
                setApplications(res.data);
            } catch (error: any) {
                if (error?.response?.status === 401) {
                    router.push('/login')
                } else if (error?.response?.status === 403) {
                    router.push('/jobs')
                } else {
                    setError("Some Error Occur");
                }
            } finally {
                setLoading(false);
            }
        }

        fetchData(slug)
    }, [slug])

    if (loading) return <div>Loading...</div>
  return (
    <div className="p-0 m-0">
        {error && <div className={error ? 'bg-red-600 text-white' : 'invisible'}>{error}</div>}

        {applications.length === 0 && !error && (<div className={applications.length === 0 ? '': 'invisible'}>No applications Found</div>)}

        {applications.map(application => (
            <div key={application._id} className="p-2 m-2 max-w-full border-2">
                <div>{application.jobId}</div>
                <div>{application.userId}</div>
                <div>{application.resume}</div>
                <div className="flex flex-row justify-between">
                    <div>{application.appliedAt}</div>
                    <div>{application.status}</div>
                </div>
            </div>
        ))}
    </div>
  )
}
