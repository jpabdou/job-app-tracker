"use client"

import { Button } from '@mui/material'
import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import LogOutLink from '@/app/components/LogOutLink';
import Link from 'next/link';
 
export default function Page() {
 const { logOutUser, user } = useContext(UserContext);
 
 // This function is called when the user clicks the "Logout" button.
 
 return (
   <>
     <h1>Welcome to the App Job Tracker</h1>
      {     
      <div className='flex justify-evenly flex-row'>
          <Link href="/login">Login</Link>
          <h2> Or </h2>
          <Link href="/signup">Signup</Link>
      </div>
     }
     {user && <LogOutLink />}
   </>
 )
}
