"use client"
import React, {useState, useEffect, useContext } from "react";
import { TableRow, TableCell, TextField, Select, MenuItem, SelectChangeEvent,FormControl, InputLabel, TableBody, Box } from "@mui/material";
import { UserContext } from "../../contexts/user.context";
import { useRouter } from "next/navigation";
import { JobEntry, Job } from "../../../types/Jobs";
import Link from "next/link";
import JobStatusSelectMaterial from "./JobStatusSelectMaterial";

interface props {
    jobId: string,
    jobNumber: number;
  }

export default function JobRowSmall(props: props) {


    const { user,token, setAlertMessage, jobs, setJobs, setEditJobNumber } = useContext(UserContext);
    const router = useRouter();

    let {jobId, jobNumber} = props;
    let initialJobEntryInput :  JobEntry ={company: "", title: "", jobNumber: jobs.length, applicationRoute: "Not Applied Yet", outreachContact: "", dateApplied: "", emailFollowup: "no", appStatus: "Not Applied Yet", user_id: "", id:"", _id: ""};
    initialJobEntryInput = jobs[jobNumber];
    
    const buttonSetting = "m-auto w-auto rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";

    const [job, setJob] = useState(initialJobEntryInput);
    const [visible, setVisible] = useState(false)

    const updateJob = async (job: JobEntry, jobId: string) => {
        const updateReq = {
            "method": "PUT",
            "body": JSON.stringify({...job, user_id: user?.id}),
            'Content-Type': 'application/json',
            "headers": {"Authentication": `Bearer ${token}`}
        };
        try {
            let url : string =  `/api/jobs/update?id=${user?.id}&jobid=${jobId}`
          const response = await fetch(`${url}`, updateReq);
          let job = await response.json();
          return job;
        } catch (error) {
                      console.error('unexpected error: ', error);
                return 'An unexpected error occurred';
                    
            }
      };

       
    const handleInput= (event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        let val: (string | number) = event.target.value;
        let name: string = event.target.name;
            setVisible(true);
            setJob({...job, [name]: val});
        }

    const handleSelectInput= (event: SelectChangeEvent) => {
        let val: (string | number) = event.target.value;
        let name: string = event.target.name;
        setVisible(true);
            setJob({...job, [name]: val});
        }
    
    const handleAppRouteInput = (event: SelectChangeEvent) =>{
        let val: string = event.target.value;
        let name: string = event.target.name;      
        const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Telescreen/Coding Test", "Referral"];
        setVisible(true);
        setJob({...job, 
            appStatus: val=== appStatusArr[0] ? appStatusArr[0] : appStatusArr[1], 
            emailFollowup: val=== appStatusArr[2] ? "yes" : "no", [name]: val});

    };

    const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"];
    const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Telescreen/Coding Test", "Rejected", "Completed Telescreen/Coding Test; Awaiting Interview", "Completed Interview Round; Awaiting Next Round", "Completed Interview; Awaiting Hiring Decision", "Hired"];





    useEffect(()=>{
        if (!user) {
            setAlertMessage({message:"Not Logged In", severity: "error"});
            router.push("/job-list");

        }
    },[])

    return (
            <TableBody>
            <TableRow
            key={`job ${jobNumber+1}`}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell scope="row"><button className="underline text-xl cursor-pointer" onClick={()=>{setEditJobNumber(job.jobNumber)}}>{job.title} &#8211; {job.company}</button></TableCell>
            <TableCell align="center">{jobs[jobNumber].dateApplied}</TableCell>         
            <TableCell align="center">
                <FormControl>
                    <JobStatusSelectMaterial jobNumber={jobId} handleFunc={handleSelectInput} selectVal={job.appStatus} />

                </FormControl>
            </TableCell>
            <TableCell align="center">
                {visible? <button className={buttonSetting} onClick={()=>{
                                let target: Job = jobs[jobNumber];
                                const {applicationRoute, outreachContact, appStatus, emailFollowup} = job
                               jobs.splice(jobNumber, 1, {...target, applicationRoute, outreachContact, emailFollowup, appStatus});
                               setJobs([...jobs]);
                               updateJob(job, jobId!).then(res=>{
                                setVisible(false);               
                            }
)
                }}>Update Job</button> : null } 
            </TableCell>
            </TableRow>
            </TableBody>
        
            );
};
