"use client"

import { Button } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useRouter } from 'next/navigation';

export default function LogInButton() {
    const { user } = useContext(UserContext);
    const router = useRouter();

    return(
        <div>{!user && <Button variant="contained" onClick={()=>{router.push("/login")}}>LogIn</Button>}
        </div>
    )}
