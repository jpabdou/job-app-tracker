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
    const {token, user, setAlertMessage, editJobNumber, setEditJobNumber, setJobs, jobs} = useContext(UserContext);
    const {jobId, buttonSetting} = props;
    const [opened, setOpened] = useState(false);
    async function getJobs(user_id:string) {
      try {
          const getReq = {
              "method": "GET",
              "Content-type": "application/json",
              "headers": {"Authentication": `Bearer ${token}`}
            };
          let url : string = `/api/jobs/read?id=${user_id}`
          const res = await fetch(`${url}`, getReq);
          if (!(res.status === 200)) {
            setAlertMessage({message: "Failed to fetch data.", severity: "error"})
              router.push("/");
            throw new Error('Failed to fetch data');
            
          }
          return res.json();
          
      } catch (e) {
          console.error(e);
      };
  
    };

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
          setAlertMessage({message: 'Deleted job', severity: "success" })
          let result = await getJobs(user?.id!)
          setJobs(result.data)

          setEditJobNumber(null)

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
    
    const handleAgree = async () => {
      await deleteJob(jobId)

        handleClose();
      };
    const handleDisagree = () => {
        handleClose();
      };


      return (
        <>
          <div onClick={handleOpen} className={`${buttonSetting} cursor-pointer`}>Delete Job</div>
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
