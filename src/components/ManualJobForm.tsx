import React, {useState, useEffect } from "react";

interface props {
    jobList: Job[];
    setJobList: (jobs: Job[]) => void;
  }
interface Job {company: string, title: string, URL: string, jobDescription: string, location: string, dateApplied: string, applicationRoute: string, outreachContact: string, emailFollowup: string, appStatus: string};

export default function ManualJobForm(props: props) {
    const currentDate = new Date().toJSON().slice(0,10);
    let {jobList, setJobList} = props;
    let initialManualJobInput :  Job ={company: "", title: "", URL: "", jobDescription: "", location: "", dateApplied: currentDate, applicationRoute: "Not Applied Yet", outreachContact: "", emailFollowup: "no", appStatus: "Not Applied Yet"};
    const h2Setting = "text-2xl text-left";
    const labelSetting = "w-auto h-auto flex flex-row justify-evenly my-2";
    const inputSetting = "w-auto h-auto";
    const formSetting = "w-1/2 h-1/2 flex flex-col flex-wrap justify-evenly content-left";
    const buttonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";
    const disabledButtonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-gray-700 text-white hover:bg-gray-200 hover:text-black";

    const [manualJob, setManualJob] = useState(initialManualJobInput);
    const [manualDisabled, setManualDisabled] = useState(true);

    const onSubmitManualInput = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const jobEntry: Job = manualJob;
        setJobList([...jobList, jobEntry]);
        setManualJob(initialManualJobInput);
    }

    const handleChangeInput= (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        let val: string = event.target.value;
        let name: string = event.target.name;

            setManualJob({...manualJob, [name]: val});
        }
    
    const handleAppRouteInput = (event: React.ChangeEvent<HTMLSelectElement>) =>{
        let val: string = event.target.value;
        let name: string = event.target.name;      
        const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen"];

        if (val === "Referral") {
            setManualJob({...manualJob, appStatus: appStatusArr[1], emailFollowup: "yes", [name]: val});
        } else if (val === "Not Applied Yet") {
            setManualJob({...manualJob, appStatus: appStatusArr[0], emailFollowup: "no", [name]: val});
        } else {
            setManualJob({...manualJob, appStatus: appStatusArr[1], emailFollowup: "no", [name]: val});
        }
    };

    const requiredArr:  Array<string> = ["company", "title", "URL", "location"];
    const inputArr: Array<string[]> = [["company","Company Name"],["title","Job Title"],["location","Job Location"],["URL","URL"],["dateApplied","Application Date"]];
    const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor", "Other"];
    const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Rejected", "Completed Phone Screen; Awaiting Interview", "Completed Interview Round; Awaiting Next Round", "Completed Interview; Awaiting Hiring Decision", "Hired"];
    
    const jobTest = (requiredElements: Array<string>, job: Job) =>{
        return requiredElements.some(ele=>{return job[ele as keyof Job].length === 0});

    };

    const manualErrorSetting = () => {
        setManualDisabled(jobTest(requiredArr, manualJob));
    }
    
    useEffect(() =>{
        manualErrorSetting();
        },[manualJob]);

    return (
        <div className="w-full">
            <h2 className={h2Setting}>Manually enter the job below:</h2>
            <form className={formSetting} onSubmit={onSubmitManualInput}>
                {inputArr.map(inputElement=>{
                    return(                
                    <label key={inputElement[0]} className={labelSetting}>
                        Enter {inputElement[1]}: 
                        <input name={inputElement[0]} className={inputSetting} type={inputElement[0] === "dateApplied" ? "date" : "text"} value={manualJob[inputElement[0] as keyof Job]} placeholder={`Enter ${inputElement[1]} Here`} onChange={handleChangeInput} />
                        
                    </label>)
                })}
                <label className={labelSetting}>
                    Enter the Application Method/Source:
                    <select name="applicationRoute" onChange={handleAppRouteInput}>
                    {applicationRouteArr.map(choice=>{
                        return(<option key={choice} className={inputSetting} value={choice}>{choice}</option>)
                    })}
                    </select>

                </label>
                {manualJob.applicationRoute!=="Referral" && manualJob.applicationRoute!=="Not Applied Yet" ?                     
                <label className={labelSetting}>
                Have you sent a follow-up email to a recruiter or hiring manager for this application?
                <select name="emailFollowup" value={manualJob.emailFollowup} onChange={handleChangeInput}>
                    <option className={inputSetting} value="no">No</option>
                    <option className={inputSetting} value="yes">Yes</option>
                </select>
                </label>
                    : null}
                {manualJob.emailFollowup ==="yes" ?                     
                <label className={labelSetting}>
                        Enter Contact Name: 
                        <input name="outreachContact" className={inputSetting} type="text" value={manualJob["outreachContact" as keyof Job]} placeholder="Enter Contact Here" onChange={handleChangeInput} />
                    </label> 
                    : null}
                <label className={labelSetting}>
                    Enter Job Description:
                    <textarea name="jobDescription" className={inputSetting} value={manualJob.jobDescription} placeholder='Enter Job Description Here' onChange={handleChangeInput} />
                </label><br></br>
                <label className={labelSetting}>
                    Enter the Application Status:
                    <select name="appStatus" value={manualJob.appStatus} onChange={handleChangeInput}>
                    {appStatusArr.map(choice=>{
                        return(<option key={choice} className={inputSetting} value={choice}>{choice}</option>)
                    })}
                    </select>

                </label>
                <button className={manualDisabled ? disabledButtonSetting : buttonSetting} disabled={manualDisabled}>Submit Job Entry</button>                
            </form>
            </div>
            );
};
