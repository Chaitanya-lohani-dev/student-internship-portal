"use client";
import { useEffect, useState } from "react";
import { getStudentJobs } from '../lib/api.ts';
export default function Student() {
    const [data, setData] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchJobs = async () => {
            try {
                const res = await getStudentJobs();
                setData(res.data);
            } catch (error) {
                setError("Unauthorized or error fetching data")
            }
        };

        fetchJobs();
    }, []);

    if (error) return <div>{error}</div>
    if (!data) return <div>Lodaing... </div>

    return <pre>{JSON.stringify(data, null, 2)}</pre>;
}
