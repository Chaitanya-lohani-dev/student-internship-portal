'use client';
import { useState} from 'react'
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { registerAPI } from '../lib/api.ts';

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

export default function Register() {
  const [state, setState] = useState(null);
  const router = useRouter();

  const handelSubmit = async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const validation = registerSchema.safeParse(data);

    if (!validation.success) {
        setState(<div className='bg-red-600 text-white'>Invalid Data Please try again</div>);
        return;
    }

    const { name, email, password} = validation.data;

    const res = await registerAPI(name, email, password);

    if (res.message === "User Registered"){
      setState(<div className='text-white bg-green-600'>User Registered Successfullly</div>)
    }else if (res.message === 'User all ready exists') {
      setState(<div className='bg-red-600 text-white font-bold'>User Already Exist please Login</div>)
      setTimeout(() => router.push("/login"), 2000)
    } else {
      setState(<div className='text-white bg-red-600'> Error Trying to Register</div>)
    }
  }
  
  return (
    <div>
      <form onSubmit={handelSubmit}>
        <label>Name</label>
        <input type='text' name='name'required></input>
        <label>Email</label>
        <input type='email' name='email'required></input>
        <label>Password</label>
        <input type='password' name='password'required></input>
        <button type='submit'>Submit</button>
      </form>
      {state}
    </div>
  )
}
