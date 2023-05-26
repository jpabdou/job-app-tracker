"use client"

import { Button } from '@mui/material'
import { useContext } from 'react';
import { UserContext } from '../contexts/user.context';
import LogOutLink from '@/app/components/LogOutLink';
import Link from 'next/link';
import { useEffect } from 'react';
import NavBar from './components/NavBar';


export default function Page() {
 const { user, getValidAccessToken, fetchUser } = useContext(UserContext);
 
// Once a user logs in to our app, we don’t want to ask them for their
// credentials again every time the user refreshes or revisits our app, 
// so we are checking if the user is already logged in and
// if so we are redirecting the user to the home page.
// Otherwise we will do nothing and let the user to login.
const loadToken = async () => {
  try {
    if (user) {
      await getValidAccessToken(user);
    }
  } catch (err) {
    console.error(err)
  }

}

// This useEffect will run only once when the component is mounted.
// Hence this is helping us in verifying whether the user is already logged in
// or not.
useEffect(() => {
  loadToken(); // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);


 return (
  <div>
    <NavBar />
  <div className='w-full my-10 text-center'>
   <div className='flex flex-col justify-around w-1/3 mx-auto'>
      {!user &&     
      <div className='flex justify-evenly flex-row'>
          <Link href="/login" className="text-2xl underline">Login</Link>
          <h2 className="text-xl"> Or </h2>
          <Link href="/signup" className="text-2xl underline">Signup</Link>
      </div>
     }
     {user && 
     <div className='flex justify-evenly flex-row text-2xl underline'>
      <LogOutLink />
      </div>}
   </div>
  </div>
  </div>


 )
}
