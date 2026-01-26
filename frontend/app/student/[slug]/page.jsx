"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getStudentJob, submitApplication } from '../../lib/api.ts';

export default function StudentJobPage() {
    const [data, setData] = useState(null);
    const [loding, setLoding] = useState(true);
    const [error, setError] = useState(null);

    const { slug } = useParams();

    const router = useRouter();

    const handelSubmit = async (e) => {
        e.preventDefault();
        // TODO: Resume upload logic to be added here before submitting
        // const res = await submitApplication(id, resume);
    }

    useEffect(() => {

        const fetchData = async (slug) => {
            try {
                if (!slug) {
                    setError('Some Error Occurred');
                    setTimeout(() => router.push('/student/jobs'), 200);
                    return;
                }

                const jobData = await getStudentJob(slug);
                if (jobData) {
                    setData(jobData);
                } else {
                    setError('Some error occur')
                }
            } catch (error) {
                if (error.response?.status === 401) {
                    setError('Plase Retry after Login....')
                    setTimeout(() => router.push('/login'), 200)
                }

                if (error.response?.status === 429) {
                    setError("Too many request please try again after some time... ")
                }
            } finally {
                setLoding(false)
            }
        }
        fetchData(slug);
    }, [slug]);

    if (loding) return (<div>Loding...</div>)
    if (error) return (<div className={error ? 'bg-red-700 text-white' : 'invisible'}>{error}</div>)
    return (
        <div className=' bg-gray-300 w-full h-full font-bold'>
            <div className='m-5 p-5'>
                <form onSubmit={(e) => handelSubmit(e)}>
                    <div className=''>
                        <div className='text-4xl'>{data.title}</div>
                        <div className='text-2xl'>{data.description}</div>
                        <div className='flex flex-row justify-between'>
                            <div>Closes At Date: {data.closesAt.slice(0, 10)}</div>
                            <div>Closes At Time: {data.closesAt.slice(11, 16)}</div>
                            <div className={data?.lastUpdated ? '' : 'invisible'}>Last Updated Date: {data?.lastUpdated ? data?.lastUpdated.slice(0, 10) : ''}</div>
                            <div className={data?.lastUpdated ? '' : 'invisible'}>Last Updated Time{data?.lastUpdated ? data?.lastUpdated.slice(11, 16) : ''}</div>
                        </div>
                    </div>
                    <input className='block' type="file" name="resume" id="resume" required />
                    <button type="button" className='p-2 m-2 justify-center bg-amber-600
                    text-white'>submit</button>
                </form>
            </div>
        </div>
    )
}
