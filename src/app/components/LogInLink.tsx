"use client"
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import LogOutLink from './LogOutLink';
export default function LogInLink() {
  const { user, fetchUser } = useContext(UserContext);


    return(
      <div>        
      {!user ? <Link href="/login" >Login</Link> : <LogOutLink />}
      </div>

    )}
