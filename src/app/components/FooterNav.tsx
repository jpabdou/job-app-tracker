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
                <nav className='flex flex-col flex-wrap justify-evenly text-center align-middle text-xl underline my-2'>
                <div>
                <Link href="/">Home</Link>

                </div>
                <div className='w-full flex flex-row flex-nowrap align-center justify-center h-50 my-2'>
                <a href="https://github.com/jpabdou/job-app-tracker" className='mr-2 self-center'>View Source Code</a>
                <a href="https://github.com/jpabdou/job-app-tracker" className='align-center'><Image placeholder="blur" blurDataURL={'/github_PNG40-1417037603.png'} src="/github_PNG40-1417037603.png" alt="github icon" width={50} height={50} /></a>

               </div>
                <div className='w-full flex align-center justify-center h-50'>
                <a href="mailto:jobapptracker074@gmail.com" className='mr-2 self-center'>Email Me</a>
                <a href="mailto:jobapptracker074@gmail.com"><Image placeholder="blur" blurDataURL={'/email-icon-png-email-icon-image-122-1600.png'} src="/email-icon-png-email-icon-image-122-1600.png" alt="email icon" width={50} height={50} /></a>
                </div>
                </nav>
            </footer>
)
}
