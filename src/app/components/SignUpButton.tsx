"use client"

import { Button } from '@mui/material';
import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useRouter } from 'next/navigation';

export default function SignUpButton() {
    const { user } = useContext(UserContext);
    const router = useRouter();

    return(
        <>{!user && <Button variant="contained" onClick={()=>{router.push("/signup")}}>SignUp</Button>}
        </>
    )}
