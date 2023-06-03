"use client"

import { useContext, useState } from 'react';
import { UserContext } from '../../contexts/user.context';
import { useRouter } from 'next/navigation';
import { Job } from "../../../types/Jobs";
import { Dialog, DialogActions, DialogContent, DialogTitle,DialogContentText, Button } from '@mui/material';

interface props {
    jobId: string,
    buttonSetting: string
  }

export default function DeleteButton(props: props) {
    const router = useRouter();
    const {token, user, setAlertMessage} = useContext(UserContext);
    const {jobId, buttonSetting} = props;
    const [opened, setOpened] = useState(false);

    const deleteJob = async (jobId: string) => {
        const deleteReq = {
            "method": "DELETE",
            'Content-Type': 'application/json',
            "headers": {"Authentication": `Bearer ${token}`}
        };
        try {
            let url : string =  `/api/jobs/delete?id=${user?.id}&jobid=${jobId}`
          const response = await fetch(`${url}`, deleteReq);
          let job = await response.json();
          router.push("/job-list")
          return job;
        } catch (error) {
                      console.error('unexpected error: ', error);
                setAlertMessage({message: 'An unexpected error occurred', severity: "error" })
                return 'An unexpected error occurred';
                    
            }
      };

      const handleOpen = () => {
        setOpened(true);
      };
    
    const handleClose = () => {
        setOpened(false);
      };
    
    const handleAgree = () => {
      deleteJob(jobId)
        handleClose();
      };
    const handleDisagree = () => {
        handleClose();
      };


      return (
        <>
          <button onClick={handleOpen} className={buttonSetting}>Delete Job</button>
                <Dialog
                open={opened}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
                >
          <DialogTitle id="alert-dialog-title">
            Delete Job
          </DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
              Are you sure you want to delete this job?
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
        </>)

 
}
