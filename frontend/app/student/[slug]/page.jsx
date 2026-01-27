"use client";
import { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { getStudentJob, submitApplication } from '@/app/lib/api.ts';
import { useEdgeStore } from '@/app/lib/edgestore.ts';
import Navbar from '@/app/components/Navbar';

export default function StudentJobPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [file, setFile] = useState(null);
    const { edgestore } = useEdgeStore();
    const [uploadProgress, setUploadProgress] = useState(0);
    const [statusMessage, setStatusMessage] = useState(null);

    const params = useParams();
    const slug = Array.isArray(params.slug)
        ? params.slug[0]
        : params.slug;

    const router = useRouter();

    const handelSubmit = async (e) => {
        try {
            e.preventDefault();
            if (!file) {
                setError("Please upload the file...")
                return;
            }

            const resumeUrl = await edgestore.publicFiles.upload({
                file,
                onProgressChange: (progress) => {
                    setUploadProgress(progress);
                },
            });
            const res = await submitApplication(slug, resumeUrl.url);
            
            if (res.status === 201) {
                setStatusMessage("Sucessfully Submited the application");
            }

        } catch (error) {
            if (error.response?.status === 409) {
                setStatusMessage("Application Alredy Exists");
            } else {
                setStatusMessage("Some error occour")
            }
        } finally {
            setTimeout(() => setStatusMessage(null),2000);
        }
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
                setLoading(false)
                setFile(null)
                setUploadProgress(0);
            }
        }
        fetchData(slug);
    }, [slug]);

    if (loading) return (<div>Loding...</div>)
    if (error) return (<div className={error ? 'bg-red-700 text-white' : 'invisible'}>{error}</div>)
    return (
        <div>
            <Navbar />
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
                        <input className='block' type="file" name="resume" id="resume" onChange={(e) => { setFile(e.target.files?.[0]); }} />
                        <button type="submit" className='p-2 m-2 justify-center bg-amber-600
                        text-white' disabled={uploadProgress > 0 && uploadProgress>100}>{uploadProgress>0 ? 'submitting..' : 'submit'}</button>
                    </form>
                    <div className={uploadProgress > 0 ? 'bg-green-600 text-white' : 'invisible'}>{uploadProgress}</div>
                    {statusMessage !== null && <div className={statusMessage !== null ? 'bg-green-600 text-white' : 'invisible'}>{statusMessage}</div>}
                </div>
            </div>
        </div>
    )
}
