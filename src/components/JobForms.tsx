import React, {useState, useEffect } from "react";
import axios, { AxiosError } from 'axios';

interface props {
    jobList: Job[];
    setJobList: (jobs: Job[]) => void;
  }
interface Job {company: string, title: string, URL: string, jobDescription: string, location: string, dateApplied: string, applicationRoute: string, outreachContact: string, emailFollowup: string, appStatus: string};

export default function JobForms(props: props) {
    interface JobError {company: number[], title: number[], URL: number[], jobDescription: number[], location: number[]};
    // let initialJobErrors : JobError = {company: [], title: [], URL: [], jobDescription: [], location: []};

    let {jobList, setJobList} = props;

    let initialJobEntries : Job[] = [];
    let initialErrors : number[] = []

    const [errors, setErrors] = useState(initialErrors);
    const [jobListDisabled, setJobListDisabled] = useState(errors.length >0);


    const h2Setting = "text-2xl text-left";
    const labelSetting = "w-auto h-auto flex flex-row justify-evenly my-2";
    const inputSetting = "w-auto h-auto";
    const formSetting = "w-1/2 h-1/2 flex flex-col flex-wrap justify-evenly content-left";
    const buttonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";
    const deleteSetting = "m-auto w-auto rounded-md border-2 p-3 border-black object-left bg-red-700 text-white hover:bg-red-200 hover:text-black";
    const jobDisplaySetting = "w-full flex flex-row flex-wrap justify-evenly";
    const jobSetting = "w-1/3 h-1/2 flex flex-col flex-wrap justify-evenly content-left";
    const requiredSetting = "after:content-['*'] after:ml-0.5 after:text-red-500";
    const disabledButtonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-gray-700 text-white hover:bg-gray-200 hover:text-black";

    const setJob = (job: Job, idx: number) =>{
        jobList.splice(idx, 1, job);
        setJobList([...jobList]);

    };

    const handleJobUpdateInput= (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement> , index: number) => {
        let val: string = event.target.value;
        let name: string = event.target.name;
        let jobEntry: Job = jobList[index];
        jobEntry = {...jobEntry, [name]:val};
        jobList.splice(index, 1, jobEntry);
        setJobList([...jobList]);
    };

    const handleJobUpdateAppRouteInput = (event: React.ChangeEvent<HTMLSelectElement>, index: number) =>{
        let val: string = event.target.value;
        let name: string = event.target.name;      
        const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen"];
        let jobEntry: Job = jobList[index];

        if (val === "Referral") {
            jobEntry = {...jobEntry, appStatus: appStatusArr[1], emailFollowup: "yes", [name]: val};
        } else if (val === "Not Applied Yet") {
            jobEntry = {...jobEntry, appStatus: appStatusArr[0], emailFollowup: "no", [name]:val};
        } else {
            jobEntry = {...jobEntry, appStatus: appStatusArr[1], emailFollowup: "no", [name]:val};
        }
        jobList.splice(index, 1, jobEntry);
        setJobList([...jobList]);
        errorSetting(index);
    };

    const postJob = async (job: Job) => {
        try {
          const response = await axios.post("http://localhost:5000/jobs/add", job);
          if (response.status === 404) {
            return job;
          }
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
        const promises = jobList.map((job) => postJob(job));
        const results = await Promise.all(promises);
        console.log(results);
        setJobList(initialJobEntries);


      }

      const requiredArr:  Array<string> = ["company", "title", "URL", "location"];
      const inputArr: Array<string[]> = [["company","Company Name"],["title","Job Title"],["location","Job Location"],["URL","URL"],["dateApplied","Application Date"]];
      const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"];
      const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Rejected", "Completed Phone Screen; Awaiting Interview", "Completed Interview Round; Awaiting Next Round", "Completed Interview; Awaiting Hiring Decision", "Hired"];
      


      const jobTest = (requiredElements: Array<string>, job: Job) =>{
        return requiredElements.some(ele=>{return job[ele as keyof Job].length === 0});

    };

      const errorSetting = (index: number) => {
        const requiredArr:  Array<string> = ["company", "title", "URL", "location"];

        let job = jobList[index];
        if (jobTest(requiredArr, job)) {
            setErrors([...errors, index])
        } else {
            let newErrors = errors.filter(error=> error!== index);
            setErrors([...newErrors])

        };
        setJobListDisabled(errors.length >0)

    }


    return (
        <div className="w-full">
            <form onSubmit={onSubmitJobList}>
            <span className={jobDisplaySetting}>
            {jobList.map((job, idx)=>{
                return(            
                    <div className={jobSetting} key={idx}>
                    <h2 className={h2Setting} >Job #{idx+1}</h2>
                    <div className={deleteSetting} onClick={()=>{
                        jobList.splice(idx, 1);
                        setJobList([...jobList]);}}>Delete Job</div>

                {inputArr.map(inputElement=>{
                    return(                
                    <label key={inputElement[0]} className={labelSetting}>
                        {inputElement[1]}: 
                        <input name={inputElement[0]} className={inputSetting} type={inputElement[0] === "dateApplied" ? "date" : "text"} value={job[inputElement[0] as keyof Job]} placeholder={`Enter ${inputElement[1]} Here`} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event,idx)} />
                        
                    </label>)
                })}

                <label className={labelSetting}>
                    Application Method/Source:
                    <select name="applicationRoute" onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>handleJobUpdateAppRouteInput(event,idx)}>
                    {applicationRouteArr.map(choice=>{
                        return(<option key={choice} className={inputSetting} value={choice}>{choice}</option>)
                    })}
                    </select>

                </label>
                {job.applicationRoute!=="Referral" && job.applicationRoute!=="Not Applied Yet" ?                     
                <label className={labelSetting}>
                Have you sent a follow-up email to a recruiter or hiring manager for this application?
                <select name="emailFollowup" value={job.emailFollowup} onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>handleJobUpdateInput(event,idx)}>
                    <option className={inputSetting} value="no">No</option>
                    <option className={inputSetting} value="yes">Yes</option>
                </select>
                </label>
                    : null}
                {job.emailFollowup ==="yes" ?                     
                <label className={labelSetting}>
                        Contact Name: 
                        <input name="outreachContact" className={inputSetting} type="text" value={job["outreachContact" as keyof Job]} placeholder="Enter Contact Here" onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event,idx)} />
                    </label> 
                    : null}
                <label className={labelSetting}>
                    Job Description:
                    <textarea name="jobDescription" className={inputSetting} value={job.jobDescription} placeholder='Enter Job Description Here' onChange={(event: React.ChangeEvent<HTMLTextAreaElement>)=>handleJobUpdateInput(event,idx)} />
                </label><br></br>
                <label className={labelSetting}>
                    Application Status:
                    <select name="appStatus" value={job.appStatus} onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>handleJobUpdateInput(event,idx)}>
                    {appStatusArr.map(choice=>{
                        return(<option key={choice} className={inputSetting} value={choice}>{choice}</option>)
                    })}
                    </select>

                </label>
                    </div>
                )
            })}
            </span>
                                {jobList.length >0 ? <button className={jobListDisabled ? disabledButtonSetting : buttonSetting} disabled={jobListDisabled}>Submit Job Entries to Your Job List</button> : null}                
        </form>
            </div>
            );

}
