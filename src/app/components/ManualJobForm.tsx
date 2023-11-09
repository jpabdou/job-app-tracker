"use client"
import React, {useState, useEffect, useContext } from "react";
import { UserContext } from "../../contexts/user.context";
import { useRouter } from "next/navigation";
import { Job } from "../../../types/Jobs";
import DeleteButton from "./DeleteButton";
import JobStatusSelect from "./JobStatusSelect";


export default function ManualJobForm() {


    const { user,token, setAlertMessage, setJobs, jobs, trial, setEditJobNumber, editJobNumber } = useContext(UserContext);
    const currentDate = new Date().toJSON().slice(0,10);
    const router = useRouter();

    let initialManualJobInput :  Job ={company: "", title: "", jobLink: "", jobNumber: jobs.length, jobDescription: "", location: "", dateApplied: currentDate, applicationRoute: "Not Applied Yet", outreachContact: "", emailFollowup: "no", appStatus: "Not Applied Yet"};
    let initialId = "";
    let jobInput : Job = {...initialManualJobInput}
   
    if (typeof editJobNumber === "number")  {
        jobInput = jobs[editJobNumber];
        initialId= jobs[editJobNumber].id!
    };

    const h2Setting = "text-2xl text-center";
    const h3Setting = "text-1xl text-center";
    const divInputSetting = "flex flex-row justify-center my-2 w-auto h-auto";
    const formSetting = "h-1/2 flex flex-col flex-wrap justify-evenly content-left";
    const buttonSetting = "self-center w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";
    const disabledButtonSetting = "self-center w-52 rounded-md border-2 p-3 border-black object-left bg-gray-700 text-white hover:bg-gray-200 hover:text-black";
    const requiredSetting = "after:content-['*'] after:ml-0.5 after:text-red-500";
    const highlightRequiredSetting = "bg-yellow-400";

    const [manualJob, setManualJob] = useState(jobInput);
    const [manualDisabled, setManualDisabled] = useState(true);
    const [highlightOn, setHighlightOn] = useState(false);
    const [jobId, setJobId] = useState(initialId)

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

                console.error('unexpected error: ', error);
                return 'An unexpected error occurred';
                  
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
          let result = await response.json();
          return result;
        } catch (error) {

                console.error('unexpected error: ', error);
                return 'An unexpected error occurred';
                
            }
      };

    const onSubmitJob = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        manualErrorSetting();
        if (manualDisabled) {
            setHighlightOn(true)
        } else {
            if (typeof editJobNumber === "number") {
                updateJob(manualJob, jobId).then(res=>{
                    let targetIndex : number = manualJob.jobNumber;
                    jobs.splice(targetIndex, 1, manualJob);
                    setJobs([...jobs]);
                    router.push("/job-list")


                })

            } else {
                postJob(manualJob).then(res=>{
                    jobs.push({...manualJob, _id: res.data.insertedId, id: res.data.insertedId.toString()});
                    setJobs([...jobs]);
                    router.push("/job-list")
                })
                .catch(err=>{
                    console.error(err);
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
        const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Telescreen/Coding Test"];

        setManualJob({...manualJob, 
            appStatus: val=== appStatusArr[0] ? appStatusArr[0] : appStatusArr[1], 
            emailFollowup: val=== "Referral" ? "yes" : "no", 
            [name]: val});

    };

    const requiredArr:  Array<string> = ["company", "title", "jobLink", "location"];
    const inputArr: Array<string[]> = [["company","Company Name"],["title","Job Title"],["location","Job Location"],["jobLink","Job Link"],["dateApplied","Application Date"]];
    const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"];

    useEffect(()=>{
        if (!(user?.isLoggedIn) ) {
            setAlertMessage({message:"Not Logged In", severity: "error"})
            router.push("/login")
        }
    },[])
    const jobTest = (requiredElements: Array<string>, job: Job) =>{
        
        return requiredElements.some(ele=>{return job[ele as keyof Job as Exclude<keyof Job, ["_id", "id", "jobNumber","user_id"]>]?.trim().length === 0});

    };

    useEffect(()=>{
        if (typeof editJobNumber === "number")  {
            jobInput = jobs[editJobNumber];
            initialId= jobs[editJobNumber].id!
        } else {

            jobInput = initialManualJobInput
            initialId =""
        }
        setManualJob(jobInput)
        setJobId(initialId)

    }, [editJobNumber])

    const manualErrorSetting = () => {
        setManualDisabled(jobTest(requiredArr, manualJob));
    }

    useEffect(()=>{
        if (!(user?.isLoggedIn) ) {
            setAlertMessage({message:"Not Logged In", severity: "error"})
            router.push("/login")
        }
    },[])

    useEffect(() =>{
        manualErrorSetting();
        },[manualJob]);



    return (
        <div className="w-full text-center">
            {trial && <h1 className="text-3xl font-bold text-center">Do note that trial data cannot be modified on the server and is for demonstration purposes only.</h1>}
            {jobId ? <a className={h2Setting + " underline"} href={manualJob.jobLink}>Click here to view original job posting or</a> : null}
            <h2 className={h2Setting}>{jobId ? "view or update job details below" : "Enter the job details below:"}</h2> <h3 className={h3Setting+ " " + requiredSetting}>Required Fields</h3>
            <form className={formSetting} onSubmit={onSubmitJob}>
                {inputArr.map(inputElement=>{
                    return( 
                        <div key={inputElement[0]} className={divInputSetting}>
                    <label htmlFor={inputElement[0]} className={`${requiredSetting} ${highlightOn && manualJob[inputElement[0] as keyof Job as Exclude<keyof Job, ["_id", "jobNumber", "id","user_id"]>].trim().length ===0 && highlightRequiredSetting}`}>
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
                <JobStatusSelect handleFunc={handleChangeInput} selectVal={manualJob.appStatus} inputSetting={divInputSetting} />


                <div className="my-2 flex flex-row justify-evenly">
                    {jobId && <DeleteButton buttonSetting={buttonSetting} jobId={jobId} />}
                    <button type="submit" className={manualDisabled ? disabledButtonSetting : buttonSetting}>{manualDisabled ? `Fill ${highlightOn ? "Highlighted" : ""} Required Fields` : `${typeof editJobNumber === "number" ? "Update" : "Submit"} Job Entry` }</button>                
                    {jobs.length !==0 && <div className={`${buttonSetting} cursor-pointer`} onClick={()=>{setEditJobNumber(null)}}>Cancel</div>}
                </div>
            </form>


            </div>
            );
};
