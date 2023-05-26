"use client"
import Link from 'next/link';
import { useState, useContext, useEffect } from 'react';
import { UserContext } from '../../contexts/user.context';
import LogOutLink from './LogOutLink';

export default function SignUpLink() {
    const { user } = useContext(UserContext);
 
    return(
      <div>        
      {!user ? <Link href="/signup" >SignUp</Link> : <Link href="/Profile" >Profile</Link>}
      </div>

    )}
