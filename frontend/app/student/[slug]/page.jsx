"use client";
import { useState,useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getStudentJob, submitApplication } from '../../lib/api.ts';

export default function StudentJobPage() {
    const [data,setData] = useState(null);
    const [loding,setLoding] = useState(true);
    const [error,setError] = useState(null);
    
    const { slug } = useParams();
    const router = useRouter();
    
    const handelSubmit = async(e, slug) => {
        e.preventDefault();
        // TODO: Resume upload logic to be added here before submitting
        // const res = await submitApplication(id, resume);
    }

    useEffect(() => {

        const fetchData = async(slug) => {
            const jobData = await getStudentJob(slug);
            if (jobData) {
                setData(jobData);
            }else {
                setError(<div className='bg-red-600 text-white'>Some error occur</div>)
            }
            setLoding(false)
        }
        fetchData(slug);
    }, [slug]);

    if(loding) return(<div>Loding...</div>)
    if(error) return(<>{error}</>)
    return (
        <form onSubmit={(e) => handelSubmit(e, slug)}>
                <div className=''>
                    <div className=''>{data.title}</div>
                    <div className=''>{data.description}</div>
                    <div>{data.closesAt}</div>
                    <div>{data?.lastUpdated}</div>
                </div>
            <input type="file" name="resume" id="resume" />
            <button type="submit">submit</button>
        </form>
    )
}
