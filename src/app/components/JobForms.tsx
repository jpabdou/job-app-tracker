"use client"

import React, {useState, useEffect } from "react";
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import JobStatusSelect from "./JobStatusSelect";

interface props {
    jobList: Job[];
    setJobList: (jobs: Job[]) => void;
  }
interface Job {company: string, title: string, jobLink: string, jobDescription: string, location: string, dateApplied: string, applicationRoute: string, outreachContact: string, emailFollowup: string, appStatus: string};

function JobForms(props: props) {
    interface JobError {company: number[], title: number[], jobLink: number[], jobDescription: number[], location: number[]};
    // let initialJobErrors : JobError = {company: [], title: [], jobLink: [], jobDescription: [], location: []};

    let {jobList, setJobList} = props;

    let initialJobEntries : Job[] = [];
    let initialErrors : number[] = []

    const [errors, setErrors] = useState(initialErrors);
    const [jobListDisabled, setJobListDisabled] = useState(errors.length >0);
    const [highlightOn, setHighlightOn] = useState(false);
    const router = useRouter();


    const h2Setting = "text-2xl text-left";
    const divInputSetting = "flex flex-row justify-center my-2 w-auto h-auto"
    const buttonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";
    const deleteSetting = "m-auto w-auto rounded-md border-2 p-3 border-black object-left bg-red-700 text-white hover:bg-red-200 hover:text-black";
    const jobDisplaySetting = "w-full flex flex-row flex-wrap justify-evenly";
    const jobSetting = "w-1/3 h-1/2 flex flex-col flex-wrap justify-evenly content-left";
    const requiredSetting = "after:content-['*'] after:ml-0.5 after:text-red-500";
    const disabledButtonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-gray-700 text-white hover:bg-gray-200 hover:text-black";
    const highlightRequiredSetting = "bg-yellow-400"

    const setJob = (job: Job, idx: number) =>{
        jobList.splice(idx, 1, job);
        setJobList([...jobList]);

    };

    const deleteJob = (idx: number) => {
        jobList.splice(idx, 1);
        setJobList([...jobList]);
    }

    const handleJobUpdateInput= (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement> , index: number) => {
        let val: string = event.target.value;
        let name: string = event.target.name;

        let jobEntry: Job = jobList[index];
        jobEntry = {...jobEntry, [name]:val};
        setJob(jobEntry, index);
        errorSetting(index);
    };

    const handleJobUpdateAppRouteInput = (event: React.ChangeEvent<HTMLSelectElement>, index: number) =>{
        let val: (string | number) = event.target.value;
        let name: string = event.target.name;      
        const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Referral"];
        let jobEntry: Job = jobList[index];
        jobEntry = {...jobEntry, 
            appStatus: val=== appStatusArr[0] ? appStatusArr[0] : appStatusArr[1], 
            emailFollowup: val=== appStatusArr[2] ? "yes" : "no", [name]: val};
        setJob(jobEntry, index);

    };


    const postJob = async (job: Job) => {
        const config = {
            headers:{
                "Content-Type": "application/json"
            }
          };
        try {
            let {jobDescription} = job;
            if (jobDescription.length === 0) {
                jobDescription = "No Description Added"
            }
          const response = await axios.post("http://localhost:3000/api", JSON.stringify(job), config);
          return(response.data);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                console.error('Axios error message: ', error.message);
                return error.message;
              } else {
                console.error('unexpected error: ', error);
                return 'An unexpected error occurred';
              }        
            }
      };

      const onSubmitJobList = async (event: React.ChangeEvent<HTMLFormElement>) =>{
        event.preventDefault();
        if (jobListDisabled) {
            setHighlightOn(true);
        } else {
        const promises = jobList.map((job) => postJob(job));
        const results = await Promise.all(promises);
        setJobList(initialJobEntries);
        setHighlightOn(false);
        setErrors(initialErrors);
        router.push('/job-list')
    }


      }

      const requiredArr:  Array<string> = ["company", "title", "jobLink", "location"];
      const inputArr: Array<string[]> = [["company","Company Name"],["title","Job Title"],["location","Job Location"],["jobLink","URL"],["dateApplied","Application Date"]];
      const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"];
      const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Rejected", "Completed Phone Screen; Awaiting Interview", "Completed Interview Round; Awaiting Next Round", "Completed Interview; Awaiting Hiring Decision", "Hired"];
      


      const jobTest = (requiredElements: Array<string>, job: Job) =>{
        return requiredElements.some(ele=>{return job[ele as Exclude<keyof Job, ["_id", "id", "jobNumber","user_id"]>].trim().length === 0});

    };

      const errorSetting = (index: number) => {
        const requiredArr:  Array<string> = ["company", "title", "jobLink", "location"];

        let job = jobList[index];
        if (jobTest(requiredArr, job)) {
            if (!(errors.includes(index))){
            setErrors([...errors, index])}


        } else {
            let newErrors = errors.filter(error=> error!== index);
            setErrors([...newErrors])

        };
       

    }

    useEffect(() =>{
        setJobListDisabled(errors.length >0);
        },[errors]);

    return (
        <div className="w-full m-5 text-center">
            <form onSubmit={onSubmitJobList}>
            <span className={jobDisplaySetting}>
            {jobList.map((job, idx)=>{
                return(            
                    <div className={jobSetting} key={idx}>
                    <h2 className={h2Setting} >Job #{idx+1}</h2>
                    <div className={deleteSetting} onClick={()=>{
                        deleteJob(idx)
                        }}>Delete Job</div>

                {inputArr.map(inputElement=>{
                    return(                
                        <div key={inputElement[0]} className={divInputSetting}>
                    <label htmlFor={inputElement[0]} className={`${requiredSetting} ${highlightOn && job[inputElement[0] as Exclude<keyof Job, ["_id", "id", "jobNumber","user_id"]>].trim().length ===0 && highlightRequiredSetting}`}>
                        {inputElement[1]}:</label>
                        <input name={inputElement[0]} type={inputElement[0] === "dateApplied" ? "date" : "text"} value={job[inputElement[0] as keyof Job]} placeholder={`Enter ${inputElement[1]} Here`} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event,idx)} />
                        
                        </div> )
                })}

                <div className={divInputSetting}>
                <label htmlFor="applicationRoute">
                    Enter the Application Method/Source:</label>
                    <select name="applicationRoute" value={job.applicationRoute} onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>handleJobUpdateAppRouteInput(event,idx)}>
                    {applicationRouteArr.map(choice=>{
                        return(<option key={choice} value={choice}>{choice}</option>)
                    })}
                    </select>
                </div>

                {job.applicationRoute !=="Referral" && job.applicationRoute!=="Not Applied Yet" ?                     
                <label>
                Have you sent a follow-up email to a recruiter or hiring manager for this application?
                <select name="emailFollowup" value={job.emailFollowup} onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>handleJobUpdateInput(event,idx)}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
                </label>
                    : null}
                {job.emailFollowup ==="yes" ?     
                <div className={divInputSetting}>
                <label htmlFor="outreachContact">
                        Enter Contact Name:</label> 
                        <input name="outreachContact" type="text" value={job["outreachContact" as keyof Job]} placeholder="Enter Contact Here" onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event,idx)} />
                </div>              
                    : null}

                <div className={divInputSetting}>
                    <label htmlFor="jobDescription">
                    Enter Job Description:</label>
                    <textarea name="jobDescription" value={job.jobDescription} placeholder='Enter Job Description Here' onChange={(event: React.ChangeEvent<HTMLTextAreaElement>)=>handleJobUpdateInput(event,idx)} />
                </div>
                
                    <JobStatusSelect handleFunc={(event: React.ChangeEvent<HTMLSelectElement>)=>handleJobUpdateInput(event,idx)} selectVal={job.appStatus} inputSetting={divInputSetting} />
                    </div>
                )
            })}
            </span>
            {jobList.length >0 ? <button className={jobListDisabled ? disabledButtonSetting : buttonSetting}>{jobListDisabled ? `Fill ${highlightOn ? "Highlighted" : ""} Required Fields` : "Submit Job Entries to Your Job List" }</button> : null}                
        </form>
            </div>
            );

}
