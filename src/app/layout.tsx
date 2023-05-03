import './globals.css'
import Link from 'next/link'

export const metadata = {
  title: 'Job Application Tracker',
  description: 'Created with MongoDB, Express, Next, and Node',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <div className="m-5 text-center">
        <h1 className="text-3xl font-bold underline w-1/2">Welcome to the Job Application Tracker!</h1>
        <div className='w-1/2 h-fit flex flex-row flex-nowrap justify-evenly align-middle'>
        <Link className="text-2xl underline" href="/">Home</Link>
        <Link className="text-2xl underline" href="/job-entry">Job Entry</Link>
        </div>

        {children}
        </div>
      </body>
    </html>
  )
}
