"use client"

import { useContext } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useRouter } from 'next/navigation';

export default function SignUpButton() {
    const { user } = useContext(UserContext);
    const router = useRouter();
    const buttonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";

    return(
        <div>{!user && <button className={buttonSetting} onClick={()=>{router.push("/signup")}}>Sign-up</button>}
        </div>
    )}
