"use client"
import { useSearchParams, useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect, Suspense } from "react";
import { UserContext } from '@/contexts/user.context';
import { Dialog, DialogActions, DialogContent, DialogTitle,DialogContentText, Button } from '@mui/material';

export default function Page(){
    const {user, sendResetPasswordEmail, trial, setAlertMessage} = useContext(UserContext)
    const router = useRouter();

    const [opened, setOpened] = useState(false)
    const buttonSetting = "w-52 my-2 text-center rounded-md border-2 p-3 border-black place-content-center bg-lime-700 text-white hover:bg-lime-200 hover:text-black ";

    useEffect(()=>{
        if (!user) {
          setAlertMessage({message: "Not Logged In", severity: "error"});
            router.push("/login");

            
        }
    },[])
    const handleOpen = () => {
        setOpened(true);
      };
    
    const handleClose = () => {
        setOpened(false);
      };
    
    const handleAgree = () => {
        sendResetPasswordEmail(user?.profile.email || "");
        handleClose();
      };
    const handleDisagree = () => {
        handleClose();
      };

    return(
        <div className='text-center'>
           <h1 className="text-2xl text-center">Email: {user?.profile.email || `Not Logged In${trial && ", but on trial account"}`}</h1>
           {trial ? null : <button onClick={handleOpen} className={buttonSetting}>Click Here to Reset Password</button>}
           <Dialog
                open={opened}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
           <DialogTitle id="alert-dialog-title">
            Password Reset
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to reset your password?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleDisagree} color="primary">
              Disagree
            </Button>
            <Button onClick={handleAgree} color="primary" autoFocus>
              Agree
            </Button>
          </DialogActions>
        </Dialog>
        </div>

    )
}
