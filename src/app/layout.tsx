import './globals.css';
import Link from 'next/link';
import NavBar from './components/NavBar';
import React, { ReactNode } from 'react'
import { UserProvider } from '@/contexts/user.context';
export const metadata = {
  title: 'Job Application Tracker',
  description: 'Created with MongoDB, Next, and Node',
}
type Props = {
  children?: ReactNode
}
export default function RootLayout({ children}: Props) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
        {children}
        </UserProvider>
      </body>
    </html>
  )
}
