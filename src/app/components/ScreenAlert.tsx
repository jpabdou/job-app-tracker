"use client";
import { Alert, AlertColor, Snackbar } from "@mui/material";
import {useState, useEffect, useContext} from "react";
import { UserContext } from "@/contexts/user.context";

export default function ScreenAlert() {
    const {alertMessage, setAlertMessage} = useContext(UserContext);

   const [open, setOpen] = useState(false);

    useEffect(()=>{
        if (alertMessage.message.length >0){
        setOpen(true);
    } else {
            setOpen(false);
        }
    },[alertMessage.message, alertMessage.severity])
    // const handleClick = () => {
    //     setOpen(true);
    //   };

    const handleClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
        return;
    }

    setOpen(false);
    setAlertMessage({...alertMessage, message: ""});
    };

    return(
        <Snackbar open={open} autoHideDuration={3000} onClose={handleClose}>
            <Alert variant="filled" severity={alertMessage.severity as AlertColor || "error" as AlertColor} onClose={handleClose}>
            {alertMessage.message}            
            </Alert>
        </Snackbar>
    )
}
