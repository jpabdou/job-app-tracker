"use client"
import Link from 'next/link';
import React from 'react';
import LogInLink from './LogInLink';
import SignUpLink from './SignUpLink';

export default function NavBar(){
 
    return(
        <div className='m-5 text-center h-fit flex flex-col'>
            <h1 className="text-3xl font-bold underline">Welcome to the Job Application Tracker!</h1>
            <div>
                <nav className='flex flex-row flex-nowrap justify-evenly align-middle text-2xl underline'>
                <Link href="/">Home</Link>
                <Link href="/job-entry">Job Entry</Link>
                <Link href="/job-list">Job List</Link>
                <LogInLink />
                <SignUpLink />
                
                </nav>
            </div>

        </div>
)
}
