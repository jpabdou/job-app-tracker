import './globals.css';
import Link from 'next/link';
import LogOutLink from '@/app/components/LogOutLink';
import LogInLink from '@/app/components/LogInLink';
import SignUpLink from '@/app/components/SignUpLink';
import React, { ReactNode } from 'react'

export const metadata = {
  title: 'Job Application Tracker',
  description: 'Created with MongoDB, Express, Next, and Node',
}
type Props = {
  children?: ReactNode
}
export default function RootLayout({ children}: Props) {
  return (
    <html lang="en">
      <body>
        <div className="m-5 text-center">
        <h1 className="text-3xl font-bold underline ">Welcome to the Job Application Tracker!</h1>
        <div className='h-fit flex flex-row flex-nowrap justify-evenly align-middle text-2xl underline'>
        <Link href="/">Home</Link>
        <Link href="/job-entry">Job Entry</Link>
        <Link href="/job-list">Job List</Link>
        <LogInLink />
        <SignUpLink />
        <LogOutLink />
        </div>

        {children}
        </div>
      </body>
    </html>
  )
}
