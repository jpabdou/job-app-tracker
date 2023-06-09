"use client"

import { Button } from '@mui/material'
import { useContext, useState } from 'react';
import { UserContext } from '../contexts/user.context';
import LogOutLink from '@/app/components/LogOutLink';
import Link from 'next/link';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';


export default function Page() {
 const { user, getValidAccessToken, setJobs, setAlertMessage, token, fetchUser, trial } = useContext(UserContext);
 const router = useRouter();

async function getJobs(user_id:string) {
    try {
        const getReq = {
            "method": "GET",
            "Content-type": "application/json",
            "headers": {"Authentication": `Bearer ${token}`}
          };
        let url : string = `/api/jobs/read?id=${trial ? "6482c564b18df6bd4874cb5c" : user?.id}`
        const res = await fetch(`${url}`, getReq);
        if (!(res.status === 200)) {
          setAlertMessage({message: "Failed to fetch data.", severity: "error"})
            router.push("/");
          throw new Error('Failed to fetch data');
          
        }
        let result = await res.json(); 
        setJobs(result.data);
    } catch (e) {
        console.error(e)
    }

  }


const loadToken = async () => {
  try {
      await getValidAccessToken(user!);
  } catch (err) {
    console.error(err)
  }
}



 // Checking if the user is already logged in and if so, redirecting the user to the home page. Otherwise, lets the user to login.
 const loadUser = async () => {
  if (!user) {
    const fetchedUser = await fetchUser();
    return fetchedUser;
  }
}

useEffect(() => {
  loadUser(); 
  if (user) {
    loadToken();
    // getJobs(user?.id)
  }
  // eslint-disable-next-line react-hooks/exhaustive-deps
}, []);



const [hasMounted, setHasMounted] = useState(false);
useEffect(() => {
  setHasMounted(true);
}, []);
if (!hasMounted) {
  return null;
}


 return (
  <div>
  <div className='w-full my-5 text-center'>
   <div className='flex flex-col justify-around w-1/2 mx-auto'>
      <div className='my-2'>
      <h1 className='text-3xl'>What is this app for?</h1>
      --
      <h2 className='text-2xl'>I made this app to track job applications, what actions have been done for the application, and what are the results for each application. I found that a means of feedback for what application methods and actions work and don&apos;t work helps to motivate and inform the job search process and makes it feel less like a lottery.</h2>
      </div>
      <div className='my-2'>
      <h1 className='text-3xl'>Ok, cool. I&apos;m interested. Now what?</h1>
      --
      <h2 className='text-2xl'>You can get started by either:
      <ul>
        <li>• Clicking the &ldquo;Sign-up&rdquo; link in the navigation bar above or in the links below to sign up with an email and password. You will need to confirm your credentials by email and then log-in.</li>
        <li>• Clicking the &ldquo;Log-in&rdquo; link in the navigation bar above or below and click &ldquo;Sign in with Trial&rdquo; to see how app works.</li>
      </ul>
      After you have logged in, you can navigate to the &ldquo;Job Entry&rdquo; link above to enter your applications and details about your process for each application. After you enter your applications, you can navigate to the &ldquo;Job List&rdquo; page where you can view your applications and update each one as they progress or click on the job title link to view and update the job details.
      </h2>
      
      </div>
      <div className='my-2'>
      <h1 className='text-3xl'>How was this app made?</h1>
      --
      <h2 className='text-2xl'>Job App Tracker was developed in TypeScript with Next.js for the frontend and backend and with MongoDB as the NoSQL database. You can view the GitHub repository <a href="https://github.com/jpabdou/job-app-tracker" className='underline'>here</a>.
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
     {user !==undefined  && 
     <div className='flex justify-evenly flex-row text-2xl underline'>
      <LogOutLink />
      </div>}
   </div>
  </div>
  </div>


 )
}
