"use client"
import Link from 'next/link';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';

export default function SignUpLink() {
    const { user } = useContext(UserContext);

    return(
      <div>        
      {!user && <Link href="/signup" >SignUp</Link>}
      </div>

    )}
