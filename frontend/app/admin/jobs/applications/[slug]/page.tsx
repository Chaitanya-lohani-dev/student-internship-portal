'use client';
import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { getAdminApplications, adminUpdateApplicationStatus } from '@/app/lib/api';

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
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [updateLoading, setUpdateLoading] = useState<boolean>(false);
    const [updateStatus, setUpdateStatus] = useState<string | null>(null);
    const [updateError, setUpdateError] = useState<string | null>(null);

    const router = useRouter();

    const params = useParams();
    const slug = Array.isArray(params.slug)
        ? params.slug[0]
        : params.slug;

    const handelClick = async (e: any, newStatus: string, id: string) => {
        try {
            setUpdateLoading(true);
            if (!newStatus) {
                setUpdateError("Something went wrong!");
                setUpdateLoading(false);
                return;
            }

            const res = await adminUpdateApplicationStatus(id, newStatus);

            if (res.status === 200) {
                setUpdateStatus("Application Status Updated Successfully")
            }
        } catch (error: any) {
            if (error?.response?.status === 401) {
                setUpdateError("Some error Occur")
            } else if (error?.response?.status === 403) {
                setUpdateError("Unauthorized");
            } else {
                setUpdateError("Some error ocur")
            }
        } finally {
            setUpdateLoading(false);
        }
    }

    useEffect(() => {
        const fetchData = async (slug: any) => {
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

    if (loading) return <svg className="mr-3 size-5 animate-spin ..." viewBox="0 0 24 24">
    </svg>
    return (
        <div className="p-0 m-0">
            {error && <div className={error ? 'bg-red-600 text-white' : 'invisible'}>{error}</div>}

            {applications.length === 0 && !error && (<div className={applications.length === 0 ? '' : 'invisible'}>No applications Found</div>)}

            {applications.map(application => (
                <div key={application._id} className="p-2 m-2 max-w-full border-2">
                    <div>{application.jobId}</div>
                    <div>{application.userId}</div>
                    <div>{application.resume}</div>
                    <a href={application.resume} target="_black" rel="noopener noreferrer" className="p-1 m-1 bg-red-600 hover:bg-green-600">View Resume</a>
                    <div className="flex flex-row justify-between">
                        <div>{application.appliedAt}</div>
                        <div>{application.status}</div>
                        <button type='button' onClick={(e) => handelClick(e, "Selected", application._id)} className="p-1 m-1 bg-green-600 text-white font-bold hover:bg-green-800" disabled={updateLoading}>Accept Request</button>
                        <button type='button' onClick={(e) => handelClick(e, "Rejected", application._id)} className="p-1 m-1 bg-red-600 text-white font-bold hover:bg-red-800" disabled={updateLoading}>Reject Request</button>
                    </div>
                    {updateStatus && <div className={updateStatus ? "bg-green-600 text-white" : 'invisible'}>{updateStatus}</div>}
                    {updateError && <div className={updateError ? "bg-red-600 text-white" : 'invisible'}>{updateError}</div>}
                </div>
            ))}
        </div>
    )
}
