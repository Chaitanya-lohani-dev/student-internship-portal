'use client';
import { useState} from 'react'
import { z } from 'zod';
import { registerAPI } from '../lib/api.ts';

const registerSchema = z.object({
    name: z.string().min(3),
    email: z.string().email(),
    password: z.string().min(6)
});

export default function Register() {
  const [state, setState] = useState(null);
  
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

    if (res === "User Registered Successfully"){
      setState(<div className='text-white bg-green-600'>User Registered Successfullly</div>)
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
