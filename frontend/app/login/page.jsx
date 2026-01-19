'use client';
import { useState} from 'react'
import { z } from 'zod';
import { loginAPI } from '../lib/api.ts';

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6)
});

export default function Login() {
  const [state, setState] = useState(null)
  
  const handelSubmit = async(e) => {
    e.preventDefault()
    const formData = new FormData(e.target);
    const data = Object.fromEntries(formData.entries());
    const validation = loginSchema.safeParse(data);

    if (!validation.success) {
        setState(<div className='bg-red-600 text-white'>Invalid Data Please try again</div>)
        return;
    }

    const { email, password} = validation.data;

    const res = await loginAPI(email, password);

    if (res === "loginSuccess"){
      setState(<div className='text-white bg-green-600'> Login SuccessFull</div>)
    } else {
      setState(<div className='text-white bg-red-600'> Error Trying to Login</div>)
    }
  }
  
  return (
    <div>
      <form onSubmit={handelSubmit}>
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
