"use client"

import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect, Suspense } from "react";
import { UserContext } from '@/contexts/user.context';

export default function Page(){
    const {user, confirmUser} = useContext(UserContext)
    const searchParams = useSearchParams();
    const router = useRouter();
    const [message, setMessage] = useState<string>("Loading...")

    const tokenInput = searchParams.get('token');
    const tokenIdInput = searchParams.get('tokenId');
    useEffect(()=>{
        confirmUser(tokenInput!, tokenIdInput!).then(res=>{
            setMessage("Confirmation Successful")
            router.push("/login")
        }).catch(err=>{
            console.error(err)
        })
    },[])

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
 
    return(
        <div>
            <h1>{message}</h1>


        </div>

    )
}
