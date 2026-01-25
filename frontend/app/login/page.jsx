'use client';
import { useState } from 'react'
import { z } from 'zod';
import { loginAPI } from '../lib/api.ts';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Login() {
  const [state, setState] = useState(null)
  const [loading,setLoading] = useState(false);
  const [success,setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(true);

  const router = useRouter();

  const handelSubmit = async(e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const validation = loginSchema.safeParse(data);
  
      if (!validation.success) {
        setState('Invalid Data Please try again')
        return;
      }
  
      const { email, password} = validation.data;
      const res = await loginAPI(email, password);
  
      if (res === "loginSuccess"){
        setSuccess(true)
        setState('Login successful')
        setTimeout(() => router.push('/student/jobs'), 2000)
      } else {
        setState('Error Trying to Login')
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className='m-5 p-5 border-2 border-black w-120 justify-items-center bg-blue-500 text-white'>
      <form onSubmit={handelSubmit} className='flex flex-col'>
        <div className='flex flex-row font-bold'><label>Email</label><p className='text-red-600'>*</p></div>
        <input type='email' name='email' required className='block border'></input>
        <div className='flex flex-row font-bold'><label>Password</label><div className='text-red-600'>*</div></div>
        <div className='flex flex-row'><input type={showPassword ? "password": 'text'} name='password' required className='border'></input> <button type='button'onClick={()=> setShowPassword(!showPassword)}>👁️</button></div>
        <button type='submit' className='block m-2 p-2 bg-blue-600' disabled={loading}>{loading ? "submitting..." : 'submit'}</button>
      </form>
      {state!==null &&
      <div className={success ? "bg-green-700 text-white": 'bg-red-700 text-white'}>{state}</div>}
      <div className='flex justify-between space-x-2'>
        <div>
          Don't Have a account?
        </div>
        <Link href={'/register'} className='font-bold'>Register Now</Link>
      </div>
    </div>
  )
}
