"use client"
import React, {useState, useEffect, useContext } from "react";
import axios from "axios";
import { UserContext } from "../../contexts/user.context";
import { useRouter } from "next/navigation";
import { Job } from "../../../types/Jobs";
import DeleteButton from "./DeleteButton";

interface props {
    editJob: Job | undefined,
    jobId: string | undefined
  }

export default function ManualJobForm(props: props) {


    const { user,token, setAlertMessage } = useContext(UserContext);
    const currentDate = new Date().toJSON().slice(0,10);
    const router = useRouter();

    let {editJob, jobId} = props;
    let initialManualJobInput :  Job ={company: "", title: "", jobLink: "", jobDescription: "", location: "", dateApplied: currentDate, applicationRoute: "Not Applied Yet", outreachContact: "", emailFollowup: "no", appStatus: "Not Applied Yet"};
    if (jobId)  {
        initialManualJobInput = editJob!;
    };

    const h2Setting = "text-2xl text-center";
    const h3Setting = "text-1xl text-center";
    const divInputSetting = "flex flex-row justify-center my-2 w-auto h-auto";
    const formSetting = "h-1/2 flex flex-col flex-wrap justify-evenly content-left";
    const buttonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";
    const disabledButtonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-gray-700 text-white hover:bg-gray-200 hover:text-black";
    const requiredSetting = "after:content-['*'] after:ml-0.5 after:text-red-500";
    const highlightRequiredSetting = "bg-yellow-400";

    const [manualJob, setManualJob] = useState(initialManualJobInput);
    const [manualDisabled, setManualDisabled] = useState(true);
    const [highlightOn, setHighlightOn] = useState(false);

    const updateJob = async (job: Job, jobId: string) => {
        let {jobDescription} = job;
        if (jobDescription.trim().length === 0) {
            jobDescription = "No Description Added"
        }
        const updateReq = {
            "method": "PUT",
            "body": JSON.stringify({...job, user_id: user?.id}),
            'Content-Type': 'application/json',
            "headers": {"Authentication": `Bearer ${token}`}
        };
        try {
            let url :string = `/api/jobs/update?id=${user?.id}&jobid=${jobId}`

          const response = await fetch(url, updateReq);
          let job = await response.json();
          return job;
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

      const postJob = async (job: Job) => {
        let {jobDescription} = job;
        if (jobDescription.trim().length === 0) {
            jobDescription = "No Description Added"
        }
        const postReq = {
            "method": "POST",
            "body": JSON.stringify({...job, user_id: user?.id}),
            "Content-type": "application/json",
            "headers": {"Authentication": `Bearer ${token}`}
          };
        try {
          const response = await fetch(`/api/jobs/create?id=${user?.id}`, postReq);
          let job = await response.json();
          return job;
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

    const onSubmitJob = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        manualErrorSetting();
        if (manualDisabled) {
            setHighlightOn(true)
        } else {
            if (jobId) {
                updateJob(manualJob, jobId).then(res=>{
                    router.push("/job-list")

                })

            } else {
                postJob(manualJob).then(res=>{
                    router.push("/job-list");
                })
                .catch(err=>{
                    console.log(err);
                })

            }

            setHighlightOn(false)
        }

    }

    const handleChangeInput= (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        let val: (string | number) = event.target.value;
        let name: string = event.target.name;

            setManualJob({...manualJob, [name]: val});
        }
    
    const handleAppRouteInput = (event: React.ChangeEvent<HTMLSelectElement>) =>{
        let val: string = event.target.value;
        let name: string = event.target.name;      
        const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Referral"];

        setManualJob({...manualJob, 
            appStatus: val=== appStatusArr[0] ? appStatusArr[0] : appStatusArr[1], 
            emailFollowup: val=== appStatusArr[2] ? "yes" : "no", [name]: val});

    };

    const requiredArr:  Array<string> = ["company", "title", "jobLink", "location"];
    const inputArr: Array<string[]> = [["company","Company Name"],["title","Job Title"],["location","Job Location"],["jobLink","Job Link"],["dateApplied","Application Date"]];
    const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"];
    const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Rejected", "Completed Phone Screen; Awaiting Interview", "Completed Interview Round; Awaiting Next Round", "Completed Interview; Awaiting Hiring Decision", "Hired"];

    const jobTest = (requiredElements: Array<string>, job: Job) =>{
        
        return requiredElements.some(ele=>{return job[ele as keyof Job as Exclude<keyof Job, ["_id", "user_id"]>].trim().length === 0});

    };

    const manualErrorSetting = () => {
        setManualDisabled(jobTest(requiredArr, manualJob));
    }

    useEffect(() =>{
        manualErrorSetting();
        },[manualJob]);

    useEffect(()=>{
        if (!(user?.isLoggedIn) ) {
            setAlertMessage({message:"Not Logged In", severity: "error"})
            router.push("/login")

        }
    },[])

    return (
        <div className="w-full m-5 text-center">

            <h2 className={h2Setting}>{jobId ? "View or update job details below" : "Enter the job details below:"}</h2> <h3 className={h3Setting+ " " + requiredSetting}>Required Fields</h3>
            <form className={formSetting} onSubmit={onSubmitJob}>
                {inputArr.map(inputElement=>{
                    return( 
                        <div key={inputElement[0]} className={divInputSetting}>
                    <label htmlFor={inputElement[0]} className={`${requiredSetting} ${highlightOn && manualJob[inputElement[0] as keyof Job as Exclude<keyof Job, ["_id", "user_id"]>].trim().length ===0 && highlightRequiredSetting}`}>
                        Enter {inputElement[1]}:</label>
                        <input name={inputElement[0]} type={inputElement[0] === "dateApplied" ? "date" : "text"} value={manualJob[inputElement[0] as keyof Job]} placeholder={`Enter ${inputElement[1]} Here`} onChange={handleChangeInput} />
                        
                        </div>               

                    )
                })}
                <div className={divInputSetting}>
                <label htmlFor="applicationRoute">
                    Enter the Application Method/Source:</label>
                    <select name="applicationRoute" value={manualJob.applicationRoute} onChange={handleAppRouteInput}>
                    {applicationRouteArr.map(choice=>{
                        return(<option key={choice} value={choice}>{choice}</option>)
                    })}
                    </select>
                </div>



                {manualJob.applicationRoute!=="Referral" && manualJob.applicationRoute!=="Not Applied Yet" ? 
                <div className={divInputSetting}>
                    <label htmlFor="emailFollowup">
                Have you sent a follow-up email to a recruiter or hiring manager for this application?</label>
                <select name="emailFollowup" value={manualJob.emailFollowup} onChange={handleChangeInput}>
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                </select>
                </div>                    

                    : null}
                {manualJob.emailFollowup ==="yes" ?     
                <div className={divInputSetting}>
                <label htmlFor="outreachContact">
                        Enter Contact Name:</label> 
                        <input name="outreachContact" type="text" value={manualJob["outreachContact" as keyof Job]} placeholder="Enter Contact Here" onChange={handleChangeInput} />
                </div>              

                    : null}
                    <div className={divInputSetting}>
                    <label htmlFor="jobDescription">
                    Enter Job Description:</label>
                    <textarea name="jobDescription" value={manualJob.jobDescription} placeholder='Enter Job Description Here' onChange={handleChangeInput} />
                    </div>

                <br></br>
                <div className={divInputSetting}>
                <label htmlFor="appStatus">
                    Enter the Application Status:</label>
                    <select name="appStatus" value={manualJob.appStatus} onChange={handleChangeInput}>
                    {appStatusArr.map(choice=>{
                        return(<option key={choice} value={choice}>{choice}</option>)
                    })}
                    </select>
                </div>


                
                <button className={manualDisabled ? disabledButtonSetting : buttonSetting}>{manualDisabled ? `Fill ${highlightOn ? "Highlighted" : ""} Required Fields` : "Submit Job Entry" }</button>                
            </form>
            {jobId && <DeleteButton buttonSetting={buttonSetting} jobId={jobId} />}
            </div>
            );
};
