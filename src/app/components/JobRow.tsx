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

export default function JobRow(props: props) {


    const { user,token, setAlertMessage,jobs, setJobs, setEditJobNumber } = useContext(UserContext);
    const router = useRouter();

    let { jobId, jobNumber} = props;
    let initialJobEntryInput :  JobEntry ={company: "", title: "", jobNumber: jobs.length , dateApplied: "", applicationRoute: "Not Applied Yet", outreachContact: "", emailFollowup: "no", appStatus: "Not Applied Yet", user_id: "", id: "", _id:""};
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

       
    const handleTextInput= (event: React.ChangeEvent<HTMLInputElement>) => {
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
    


    const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"];

    useEffect(()=>{
        if (!user) {
            setAlertMessage({message:"Not Logged In", severity: "error"});
            router.push("/login");

        }
    },[])

    return (
            <TableRow
            key={`job ${jobNumber}`}
            tabIndex={-1}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell scope="row"><button className="underline text-xl cursor-pointer" onClick={()=>{setEditJobNumber(job.jobNumber)}}>{job.title} &#8211; {job.company}</button></TableCell>
            <TableCell align="center" sx={{fontSize: 18}}>{jobs[jobNumber].dateApplied}</TableCell>
            <TableCell align="center">
                <FormControl id={`${jobId}_appRoute_form`}>
                    <InputLabel id="applicationRoute">Application Method/Source</InputLabel>

                    <Select
                        name="applicationRoute"
                        id={`${jobId}_app_route`}
                        value={job.applicationRoute}
                        label="Application Method/Source"
                        labelId="applicationRoute"
                        onChange={handleSelectInput}
                        style={{ textAlign: 'center', width: "14rem"}}
                        variant='filled'
                    >
                        {applicationRouteArr.map(choice=>{
                            return(<MenuItem value={choice} key={choice}>{choice}</MenuItem>)
                            })}
                    </Select>
                </FormControl>   
            </TableCell>
            <TableCell align="center"> 
                <FormControl id={`${jobId}_email_followup_form`}>
                    <InputLabel id="emailFollowup">Follow-up email sent?</InputLabel>
                    <Select
                    id={`${jobId}_email_followup`}
                    name="emailFollowup"
                    value={job.emailFollowup}
                    label="Follow-up email sent?"
                    onChange={handleSelectInput}
                    labelId="emailFollowup"
                    style={{ textAlign: 'center', width: "10rem"}}
                    variant='filled'
                    >
                        <MenuItem value="no" key="no">No</MenuItem>
                        <MenuItem value="yes" key="yes">Yes</MenuItem>
                    </Select>
                </FormControl>  
            </TableCell>            
            <TableCell align="center">
                <FormControl id={`${jobId}_outreach_form`}>
                        <TextField    
                        id={`${jobId}_outreach`}
                        label="Name of outreach contact"
                        name="outreachContact"
                        value={job.outreachContact}
                        onChange={handleTextInput}
                        style={{  textAlign: 'center', width: "12rem"}}
                        variant='filled'
                    />
                </FormControl>
            </TableCell>
            <TableCell align="center">
                    <JobStatusSelectMaterial jobNumber={jobId} handleFunc={handleSelectInput} selectVal={job.appStatus} />
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
            
            );
};
