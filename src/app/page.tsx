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
    {/* <NavBar /> */}
  <div className='w-full my-5 text-center'>
   <div className='flex flex-col justify-around w-1/2 mx-auto'>
      <div className='my-2'>
      <h1 className='text-3xl'>What is this app for?</h1>
      --
      <h2 className='text-2xl'>I made this app to track job applications, what actions have been done for the application, and what are the results for each application. I found that a means of feedback for what application methods and actions work and don't work helps to motivate and inform the job search process and makes it feel less like a lottery.</h2>
      </div>
      <div className='my-2'>
      <h1 className='text-3xl'>Ok, cool. I'm interested. Now what?</h1>
      --
      <h2 className='text-2xl'>You can get started by either:
      <ul>
        <li>• Clicking the "Sign-up" link in the navigation bar above or in the links below to sign up with an email and password. You will need to confirm your credentials by email and then log-in.</li>
        <li>• Clicking the "Log-in" link in the navigation bar above or below and click "Sign in with Trial" to see how app works.</li>
      </ul>
      <br></br>
      After you have logged in, you can navigate to the "Job Entry" link above to enter your applications and details about your process for each application. After you enter your applications, you can navigate to the "Job List" page where you can view your applications and update each one as they progress or click on the job title link to view and update the job details.
      </h2>
      
      </div>
      <h2 className='text-2xl font-bold my-5'>Good luck on the search!</h2>
      
      {!user &&     
      <div className='flex justify-evenly flex-row'>
          <Link href="/signup" className="text-2xl underline">Sign-up</Link>
          <h2 className="text-xl"> Or </h2>
          <Link href="/login" className="text-2xl underline">Log-in</Link>
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
