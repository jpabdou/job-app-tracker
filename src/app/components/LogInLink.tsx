"use client"
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import LogOutLink from './LogOutLink';
export default function LogInLink() {
  const { user } = useContext(UserContext);


    return(
      <div>        
      {!user  ? <Link href="/login" >Log-in</Link> : <LogOutLink />}
      </div>

    )}
