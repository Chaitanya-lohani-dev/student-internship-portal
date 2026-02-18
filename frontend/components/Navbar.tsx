'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { logoutAPI } from '@/lib/api';

export default function Navbar() {
    const router = useRouter()

    const handleLogout = async (e: any) => {
        try {
            e.preventDefault();
            const res = await logoutAPI();
            if (res.status === 200) {
                router.push('/login')
                return;
            }

            if (res.status === 401) {
                router.push('/login')
                return;
            }
            router.push('/login')
        } catch (error: any) {
            if (error.response?.status === 500) {
                router.push('/login')
            }
        }
    }

  return (
    <div className='bg-purple-600 w-full text-white justify-around'>
      <Link href='/student/applications' className='m-2 p-2 bg-violet-700 hover:bg-violet-900'>My Applications</Link>
      <button type='button' className='m-2 p-2 bg-red-700 hover:bg-red-900' onClick={(e) => handleLogout(e)}>Logout</button>
    </div>
  )
}
