"use client"
import Link from 'next/link';
import React, {useEffect, useState} from 'react';
import Image from 'next/image';
export default function FooterNavBar(){
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
 
    return(
            <footer className='w-full'>
                <h3 className='text-xl text-center font-light'>Job Application Tracker</h3>
                <nav className='flex flex-col flex-nowrap justify-evenly text-center align-middle text-xl underline my-2'>
                <Link href="/">Home</Link>
                <div className='w-full flex align-center justify-center'>
                <a href="https://github.com/jpabdou/job-app-tracker" className='mx-2'>View Source Code</a>
                <div className='flex flex-col justify-center'>
                <a href="https://github.com/jpabdou/job-app-tracker" className='align-center'><Image src="/github_PNG40-1417037603.png" alt="github icon" width={20} height={20} /></a>

                </div>
                </div>
                <div className='w-full flex align-center justify-center'>
                <a href="mailto:jobapptracker074@gmail.com" className='mx-2'>Email Me</a>
                <div className='flex flex-col justify-center'>
                <a href="mailto:jobapptracker074@gmail.com"><Image src="/email-icon-png-email-icon-image-122-1600.png" alt="email icon" width={20} height={20} /></a>
                </div>
                </div>
                </nav>
            </footer>
)
}
