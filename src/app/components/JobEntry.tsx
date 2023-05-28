"use client"
import React, {useState, useEffect, useContext } from "react";
import { TableRow, TableCell, TextField, Select, MenuItem, SelectChangeEvent,FormControl, InputLabel, TableBody } from "@mui/material";
import { UserContext } from "../../contexts/user.context";
import { useRouter } from "next/navigation";
import { JobEntry, Job } from "../../../types/Jobs";
import Link from "next/link";

interface props {
    editJob: JobEntry,
    jobId: string,
    jobs: Job[];
    setJobs: (jobs: Job[]) => void;
    idx: number;
  }

export default function JobCard(props: props) {


    const { user,token } = useContext(UserContext);
    const router = useRouter();

    let {editJob, jobs, setJobs, jobId, idx} = props;
    let initialJobEntryInput :  JobEntry ={company: "", title: "", applicationRoute: "Not Applied Yet", outreachContact: "", emailFollowup: "no", appStatus: "Not Applied Yet"};
    initialJobEntryInput = editJob!;
    
    const buttonSetting = "m-auto w-auto rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";

    const [jobEntry, setJobEntry] = useState(initialJobEntryInput);
    const [visible, setVisible] = useState(false)

    const updateJob = async (job: JobEntry, jobId: string) => {
        const updateReq = {
            "method": "PUT",
            "body": JSON.stringify({...job, user_id: user?.id}),
            'Content-Type': 'application/json',
            "headers": {"Authentication": `Bearer ${token}`}
        };
        try {

          const response = await fetch(`/api/jobs/update?id=${user?.id}&jobid=${jobId}`, updateReq);
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
            setJobEntry({...jobEntry, [name]: val});
        }

    const handleSelectInput= (event: SelectChangeEvent) => {
        let val: (string | number) = event.target.value;
        let name: string = event.target.name;
        setVisible(true);
            setJobEntry({...jobEntry, [name]: val});
        }
    
    const handleAppRouteInput = (event: SelectChangeEvent) =>{
        let val: string = event.target.value;
        let name: string = event.target.name;      
        const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Referral"];
        setVisible(true);
        setJobEntry({...jobEntry, 
            appStatus: val=== appStatusArr[0] ? appStatusArr[0] : appStatusArr[1], 
            emailFollowup: val=== appStatusArr[2] ? "yes" : "no", [name]: val});

    };

    const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"];
    const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Rejected", "Completed Phone Screen; Awaiting Interview", "Completed Interview Round; Awaiting Next Round", "Completed Interview; Awaiting Hiring Decision", "Hired"];





    useEffect(()=>{
        if (!user) {
            router.push("/login")
            alert("Not Logged In")
        }
    },[])

    return (
        <TableBody>
            <TableRow
            key={`job ${idx+1}`}
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
            >
            <TableCell scope="row"><Link className="underline text-xl" href={`/job-list/${jobId}`}>{editJob.title} - {editJob.company}</Link></TableCell>
            <TableCell scope="row">{jobs[idx].dateApplied}</TableCell>
            <TableCell align="center">
                <FormControl>
                    <InputLabel id="applicationRoute">Application Method/Source</InputLabel>

                    <Select
                        name="applicationRoute"
                        value={jobEntry.applicationRoute}
                        label="Application Method/Source"
                        labelId="applicationRoute"
                        onChange={handleAppRouteInput}
                    >
                        {applicationRouteArr.map(choice=>{
                            return(<MenuItem value={choice} key={choice}>{choice}</MenuItem>)
                            })}
                    </Select>
                </FormControl>   
            </TableCell>
            <TableCell align="center"> 
                <FormControl>
                    <InputLabel id="emailFollowup">Follow-up email sent?</InputLabel>
                    <Select
                    name="emailFollowup"
                    value={jobEntry.emailFollowup}
                    label="Follow-up email sent?"
                    onChange={handleSelectInput}
                    labelId="emailFollowup"
                    style={{ textAlign: 'center', width: "10rem"}}

                    >
                        <MenuItem value="no" key="no">No</MenuItem>
                        <MenuItem value="yes" key="yes">Yes</MenuItem>
                    </Select>
                </FormControl>  
            </TableCell>            
            <TableCell align="center">
                <FormControl>
                        <TextField     
                        label="Name of outreach contact"
                        name="outreachContact"
                        value={jobEntry.outreachContact}
                        onChange={handleTextInput}
                        style={{  textAlign: 'center', width: "12rem"}}
                    />
                </FormControl>
            </TableCell>
            <TableCell align="center">
                <FormControl>
                    <InputLabel id="appStatus">Application Status</InputLabel>

                    <Select
                        name="appStatus"
                        value={jobEntry.appStatus}
                        label="Application Status"
                        labelId="appStatus"
                        onChange={handleSelectInput}
                        style={{  textAlign: 'center', width: "30rem"}}

                    >
                            {appStatusArr.map(choice=>{
                                return(<MenuItem key={choice} value={choice}>{choice}</MenuItem>)
                            })}
                    </Select>
                </FormControl>
            </TableCell>
            <TableCell align="center">
                {visible? <button className={buttonSetting} onClick={()=>{
                            let target: Job = jobs[idx];
                            const {applicationRoute, outreachContact, appStatus, emailFollowup} = jobEntry
                           jobs.splice(idx, 1, {...target, applicationRoute, outreachContact, emailFollowup, appStatus});
                           setJobs([...jobs]);
                           updateJob(jobEntry, jobId!).then(res=>{
                            setVisible(false);               
                        })
                }}>Update Job</button> : null } 
            </TableCell>
            </TableRow>
            </TableBody>
            );
};
