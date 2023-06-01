import './globals.css';
import NavBar from './components/NavBar';
import React, { ReactNode } from 'react'
import { UserProvider } from '@/contexts/user.context';
import ScreenAlert from "./components/ScreenAlert";

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
      <body className="bg-gradient-to-b from-indigo-300 from-10% to-70% h-full">
        <UserProvider>
          <NavBar />
          <ScreenAlert />
        {children}
        </UserProvider>
      </body>
    </html>
  )
}
