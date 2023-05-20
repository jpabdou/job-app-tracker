"use client"
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';

export default function LogInLink() {
    const { user } = useContext(UserContext);

    return(
      <>        
      {!user && <Link href="/login" >Login</Link>}
      </>

    )}
