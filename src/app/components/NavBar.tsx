"use client"
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import LogInLink from './LogInLink';
import SignUpLink from './SignUpLink';

export default function NavBar(){
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
 
    return(
        <div className='self-center text-center h-fit flex flex-col'>
            <h1 className="text-3xl font-bold my-5">Welcome to the Job Application Tracker!</h1>
            <div>
                <nav className='flex flex-row flex-nowrap justify-evenly align-middle text-2xl underline my-2'>
                <Link href="/">Home</Link>
                <Link href="/job-entry">Job Entry</Link>
                <Link href="/job-list">Job List</Link>
                <SignUpLink />
                <LogInLink />
                
                
                </nav>
            </div>

        </div>
)
}
