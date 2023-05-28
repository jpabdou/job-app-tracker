"use client"

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect, Suspense } from "react";
import { UserContext } from '@/contexts/user.context';
import LogInForm from '../components/LogInForm';

export default function Page(){
    const {user, emailPasswordReset} = useContext(UserContext)
    const searchParams = useSearchParams();
    const router = useRouter();

    const tokenInput = searchParams.get('token');
    const tokenIdInput = searchParams.get('tokenId');

    return(
        <div>
            {/* <NavBar /> */}
            <LogInForm reset={true} token={tokenInput!} tokenId={tokenIdInput!}/>
        </div>

    )
}
