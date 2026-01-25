'use client';
import { useState} from 'react'
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { registerAPI } from '../lib/api.ts';
import Link from 'next/link';

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

export default function Register() {
  const [success, setSuccess] = useState(false);
  const [loading,setLoading] = useState(false);
  const [state, setState] = useState(null);
  const [showPassword, setShowPassword] = useState(true);

  const router = useRouter();

  const handelSubmit = async(e) => {
    try {
      e.preventDefault()
      setLoading(true)
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());
      const validation = registerSchema.safeParse(data);
  
      if (!validation.success) {
        setState('Invalid Data Please try again');
        return;
      }
  
      const { name, email, password} = validation.data;
  
      const res = await registerAPI(name, email, password);
  
      if (res.message === "User Registered"){
        setSuccess(true)
        setState("User Registered Successfullly")
      }else if (res.message === 'User all ready exists') {
        setState("User Already Exist please Login")
        setTimeout(() => router.push("/login"), 2000)
      } else {
        setState('Error Trying to Register')
      }
    } finally {
      setLoading(false)
    }
  }
  
  return (
    <div className='w-full h-full m-0 p-0 justify-items-center'>
      <div className='border m-2 p-2 w-auto'>
        <form onSubmit={handelSubmit} className='flex flex-col'>
          <div className='flex flex-row space-x-1'><label>Name</label><p className='text-red-600 space-x-1'>*</p></div>
          <input type='text' name='name'required className='border'></input>
          <div className='flex flex-row space-x-1'><label>Email</label><p className='text-red-600 space-x-1'>*</p></div>
          <input type='email' name='email'required className='border'></input>
          <div className='flex flex-row space-x-1'><label>Password</label><p className='text-red-600 space-x-1'>*</p></div>
          <div className='flex flex-row'><input type={showPassword ?'password': 'text'} name='password'required className='border'></input><button type='button' onClick={() => setShowPassword(!showPassword)}>👁️</button></div>
          <button type='submit' className='w-full bg-red-700 text-white font-bold gap-y-2' disabled={loading} >{loading ? "submiting..." : 'Submit'}</button>
        </form>
        { state !==null &&
        <div className={success ? "w-full bg-green-700 text-white" : 'w-full bg-red-700 text-white'}>{state}</div>
        }
        <div>
          <p>Already have a account?</p> <Link href="/login"className='font-bold text-red-700'>Login</Link>
        </div>
        </div>
    </div>
  )
}

