"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStudentJobs } from '../../lib/api';

export default function StudentJobs() {
    const [data, setData] = useState([]);
    const [loding, setLoding] = useState(true);
    const [error, setError] = useState(null);
    const router = useRouter();

    const handleClick = async (e, id) => {
        e.preventDefault();
        router.push(`/student/${id}`)
    }

    useEffect(() => {
        const fetchdata = async () => {
            try {
                const res = await getStudentJobs();

                const jobsData = res.jobs
                if (jobsData) {
                    setData(jobsData)
                } else {
                    setError('Error Loading data')
                }
                setLoding(false)
            } catch (error) {
                if (error.response?.status === 429) {
                    setLoding(false)
                    setError('Too many requests. Try again after some time')
                }

                if (error.response?.status === 401) {
                    setLoding(false)
                    setError('Please Retry after login!')
                    setTimeout(() => router.push('/login'), 200)
                }
            }
        }
        fetchdata();
    }, [])

    if (!loding) {
        return (
            <div className="space-y-4 m-2 p-2">
                {error  & <div className={error  ? 'bg-red-600 text-white' : 'invisible'}>{error}</div>}

                {data.length === 0 && !error && (
                    <div className={ data.length ===0 ?"text-gray-700": 'invisible'}>No jobs available right now</div>
                )}
                
                {data.map(job => (
                    <div
                        key={job._id}
                        className="bg-gray-500 text-black m-1 p-1 border-2"
                        onClick={(e) => handleClick(e, job._id)}
                    >
                        <div className="font-bold text-2xl">{job.title}</div>
                        <div>{job.description.length > 120 ? job.description.slice(0, 120) + "..." : job.description}</div>
                        <div>{job.applicationCount}</div>
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div>Loding...</div>
    )
}
