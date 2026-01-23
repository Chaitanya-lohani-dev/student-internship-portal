"use client";
import {useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { getStudentJobs } from '../../lib/api';

export default function StudentJobs() {
    const [data,setData] = useState([]);
    const [loding, setLoding] = useState(true);
    const [error,setError] = useState(null);
    const router = useRouter();

    const handleClick = async(e, id) => {
        e.preventDefault();
        router.push(`/student/${id}`)
    }

    useEffect( () => {
        const fetchdata = async() => {
            try {
                const jobsData = await getStudentJobs();

                if (jobsData) {
                    setData(jobsData)
                } else {
                    setError(<div className='bg-red-600 text-white'>Error Loading data</div>)
                }
                setLoding(false)
            } catch (error) {
                if (error.response?.status === 401){
                    setError(<div className='p-5 m-5 bg-red-600 text-white'>Try try again after login</div>)
                    setTimeout(() => router.push('/login'), 2000)
                }
            }
        }
        fetchdata();
    }, [])
    
    if (!loding) {
  return (
    <div className="space-y-4">
      {error && error}

      {data.map(job => (
        <div
          key={job._id}
          className="gap-y-5 p-5 m-5 bg-white text-black"
          onClick={(e) => handleClick(e, job._id)}
        >
          <div className="font-bold text-2xl">{job.title}</div>
          <div>{job.description}</div>
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

