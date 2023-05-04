'use client';
import React, {useState } from "react";
import axios, { AxiosError } from 'axios';

export default function JobEntry() {
    const h2Setting = "text-2xl text-left"
    const labelSetting = "w-auto h-auto flex flex-row justify-evenly my-2"
    const inputSetting = "w-auto h-auto"
    const formSetting = "w-1/2 h-1/2 flex flex-col flex-wrap justify-evenly content-left"
    const buttonSetting = "m-auto w-52 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black"
    const jobDisplaySetting = "w-full flex flex-row flex-wrap justify-evenly"
    const jobSetting = "w-1/3 h-1/2 flex flex-col flex-wrap justify-evenly content-left"

    const currentDate = new Date().toJSON().slice(0,10);
    let initialUrlList : string[] = [];
    interface Job {"company": string, "title": string, "URL": string, "jobDescription": string, "location": string, "dateApplied": string, "applicationRoute": string};
    let initialManualJobInput :  Job ={"company": "", "title": "", "URL": "", "jobDescription": "", "location": "", "dateApplied": currentDate, "applicationRoute": "Not Applied Yet"};
    let initialJobEntries : Job[] = [];
    interface JobError {"company": string[], "title": string[], "URL": string[], "jobDescription": string[], "location": string[], "dateApplied": string[], "applicationRoute": string[]};
    let initialJobErrors : JobError = {"company": [], "title": [], "URL": [], "jobDescription": [], "location": [], "dateApplied": [], "applicationRoute": []};

    // const [urlList, setUrlList] = useState(initialUrlList);
    const [jobList, setJobList] = useState(initialJobEntries);
    const [manualJob, setManualJob] = useState(initialManualJobInput);
    const [jobErrors, setJobErrors] = useState(initialJobErrors);
    // const handleChange= (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    //     let val: string = event.target.value;
    //     setUrlList(val.split("\n"));

    // }

    // const onSubmitUrlList = async (event: React.ChangeEvent<HTMLFormElement>) => {
    //     event.preventDefault();
    //     for (let url of urlList) {  
    //         try {
    //             const selectors = {
    //                 container: '.jobs-search-results-list',
    //                 chatPanel: '.msg-overlay-list-bubble',
    //                 jobs: 'div.job-card-container',
    //                 link: 'a.job-card-container__link',
    //                 applyBtn: 'button.jobs-apply-button[role="link"]',
    //                 title: '.artdeco-entity-lockup__title',
    //                 company: '.job-card-container__company-name',
    //                 place: '.artdeco-entity-lockup__caption',
    //                 date: 'time',
    //                 description: '.jobs-description',
    //                 detailsPanel: '.jobs-search__job-details--container',
    //                 detailsTop: '.jobs-details-top-card',
    //                 details: '.jobs-details__main-content',
    //                 insights: '[class=jobs-unified-top-card__job-insight]', // only one class
    //                 pagination: '.jobs-search-two-pane__pagination',
    //                 privacyAcceptBtn: 'button.artdeco-global-alert__action',
    //                 paginationNextBtn: 'li[data-test-pagination-page-btn].selected + li',
    //                 paginationBtn: (index: number) => `li[data-test-pagination-page-btn="${index}"] button`,
    //             };
    //             const config = {
    //                 headers:{
    //                 "Access-Control-Allow-Origin": "*"
                    
    //                 }
    //               };

    //             const res = await axios(url, config);
	// 	        const $ = cheerio.load(res.data);
    //             if (url.includes("linkedin.com")) {
    //                 console.log(res.data);
    //                 console.log($)
    //                 const jobTitle = $(selectors.title).text();
    //                 const companyName =  $(selectors.company).text();
    //                 const location =  $(selectors.place).text();
    //                 const jobDescription =    $(selectors.description).text();
    //                 let jobEntry: Job = {"company": companyName, "title": jobTitle, "location": location,"URL": url, "jobDescription": jobDescription};
    //                 setJobList([...jobList, jobEntry]);

    //             // const scraper = new LinkedinScraper({
    //             //     headless: true,
    //             //     slowMo: 200,
    //             //     args: [
    //             //         "--lang=en-US",
    //             //     ],
    //             // });
            
    //             // // // Add listeners for scraper events
                
    //             // // // Emitted once for each processed job
    //             // scraper.on(events.scraper.data, (data) => {
    //             //     console.log(
    //             //         data.description.length,
    //             //         data.descriptionHTML.length,
    //             //         `Query='${data.query}'`,
    //             //         `Location='${data.location}'`,
    //             //         `Id='${data.jobId}'`,
    //             //         `Title='${data.title}'`,
    //             //         `Company='${data.company ? data.company : "N/A"}'`,
    //             //         `CompanyLink='${data.companyLink ? data.companyLink : "N/A"}'`,
    //             //         `CompanyImgLink='${data.companyImgLink ? data.companyImgLink : "N/A"}'`,
    //             //         `Place='${data.place}'`,
    //             //         `Date='${data.date}'`,
    //             //         `Link='${data.link}'`,
    //             //         `applyLink='${data.applyLink ? data.applyLink : "N/A"}'`,
    //             //         `insights='${data.insights}'`,
    //             //     );
    //             // });
                
    //             // // // Emitted once for each scraped page
    //             // scraper.on(events.scraper.metrics, (metrics) => {
    //             //     console.log(`Processed=${metrics.processed}`, `Failed=${metrics.failed}`, `Missed=${metrics.missed}`);        
    //             // });
            
    //             // scraper.on(events.scraper.error, (err) => {
    //             //     console.error(err);
    //             // });
            
    //             // scraper.on(events.scraper.end, () => {
    //             //     console.log('All done!');
    //             // });
            
    //             // // // Custom function executed on browser side to extract job description [optional]
    //             // const descriptionFn = () => {
    //             //     const description = document.querySelector<HTMLElement>(".jobs-description");
    //             //     return description ? description.innerText.replace(/[\s\n\r]+/g, " ").trim() : "N/A";
    //             // }
            
    //             // // // Run queries concurrently    
    //             // await Promise.all([
    //             //     // Run queries serially
    //             //     scraper.run([
    //             //         {
    //             //             options: {
    //             //                 filters: {
    //             //                     currentJobId: url
    //             //                 },       
    //             //             }                                                       
    //             //         },
    //             //     ]),
    //             // ]);
            
    //             // // // Close browser
    //             // await scraper.close();
                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            
                

    //         }} catch (err) {
    //             console.error(err)
    //         }

    //     }


    //     setUrlList(initialUrlList);
    // }

    const onSubmitManualInput = (event: React.ChangeEvent<HTMLFormElement>) => {
        event.preventDefault();
        const jobEntry: Job = manualJob
        setJobList([...jobList, jobEntry]);
        setManualJob(initialManualJobInput);
    }

    
    const handleChangeInput= (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement>) => {
        let val: string = event.target.value;
        let name: string = event.target.name;
        setManualJob({...manualJob, [name]: val});
    }


    const handleJobUpdateInput= (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement> , index: number) => {
        let val: string = event.target.value;
        let name: string = event.target.name;
        let jobEntry: Job = jobList[index];
        jobEntry = {...jobEntry, [name]:val};
        jobList.splice(index, 1, jobEntry);
        setJobList([...jobList]);
    }

    // const handleJobUpdateText= (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
    //     let val: string = event.target.value;
    //     let name: string = event.target.name;
    //     let jobEntry: Job = jobList[index];
    //     jobEntry = {...jobEntry, [name]:val};
    //     jobList.splice(index, 1, jobEntry);
    //     setJobList([...jobList]);
    // }

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
      }

      const onSubmitJobList = async (event: React.ChangeEvent<HTMLFormElement>) =>{
        event.preventDefault();
        const promises = jobList.map((job) => postJob(job));
        const results = await Promise.all(promises);
        console.log(results);
        setJobList(initialJobEntries);


      }

      const inputArr: Array<string[]> = [["company","Company Name"],["title","Job Title"],["location","Job Location"],["URL","URL"],["dateApplied","Application Date"]]
      const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor"]
    //   const applicationRouteArr: Array<string> = ["Company Career Site", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor"]


    //   let myobj = {
    //     company: req.body.company,x
    //     title: req.body.title,x
    //     URL: req.body.url,x
    //     jobDescription: req.body.jobDescription,x
        //     dateApplied: req.body.dateApplied,x
    //     location: req.body.location,x

    //     applicationRoute: req.body.applicationRoute,x
    //     outreach: req.body.outreach,

    //     appStatus: req.body.appStatus,
    //     result: req.body.result,
    //     outreachContact: req.body.outreachContact,
    //   };
    return (
        <div className="w-full">
            {/* <form onSubmit={onSubmitUrlList}>
                <label>
                    Enter URLs to LinkedIn jobs that you want to parse separated by line:
                    <br></br>
                    <textarea value={urlList.join("\n")} onChange={handleChange} rows={10} cols={50} />
                </label>
                <br></br>
                <button>Search URLs for relevant information</button>
            </form> */}

            {/* {urlList.map((listing, idx)=>{return(<p key={idx}>{listing}</p>)})} */}
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
                    <select name="applicationRoute" onChange={handleChangeInput}>
                    {applicationRouteArr.map(choice=>{
                        return(<option key={choice} className={inputSetting} value={choice}>{choice}</option>)
                    })}
                    </select>

                </label><br></br>
                {/* <label className={labelSetting}>
                    Enter Company Name: 
                    <input name="company" className={inputSetting} type="text" value={manualJob.company} placeholder='Enter Company Name Here' onChange={handleChangeInput} />
                </label>
                <br></br>
                <label className={labelSetting}>
                    Enter Job Title Name:
                    <input name="title" className={inputSetting} type="text" value={manualJob.title} placeholder='Enter Job Title Here' onChange={handleChangeInput} />
                </label>
                <br></br>
                <label className={labelSetting}>
                    Enter Job Location:
                    <input name="location" className={inputSetting} type="text" value={manualJob.location} placeholder='Enter Job Location Here' onChange={handleChangeInput} />
                </label>
                <br></br>
                <label className={labelSetting}>
                    Enter URL:
                    <input name="URL" className={inputSetting} type="text" value={manualJob.URL} placeholder='Enter URL Here' onChange={handleChangeInput} />
                </label> 
                <br></br>
                <label className={labelSetting}>
                    Enter Application Date:
                    <input name="dateApplied" type="date" className={inputSetting} value={manualJob.dateApplied} onChange={handleChangeInput} />
                </label><br></br>                */}
                <label className={labelSetting}>
                    Enter Job Description:
                    <textarea name="jobDescription" className={inputSetting} value={manualJob.jobDescription} placeholder='Enter Job Description Here' onChange={handleChangeInput} />
                </label><br></br>
                <button className={buttonSetting}>Submit Job Entry</button>                
            </form>
            <br></br>
            <form onSubmit={onSubmitJobList}>
            <span className={jobDisplaySetting}>
            {jobList.map((job, idx)=>{
                return(            
                    <div className={jobSetting} key={idx}>
                    <h2 className={h2Setting} >Job #{idx+1}</h2>
                    {inputArr.map(inputElement=>{
                    return(                
                    <label key={`${idx}-${inputElement[0]}`} className={labelSetting}>
                        {inputElement[1]}: 
                        <input name={inputElement[0]} className={inputSetting} type={inputElement[0] === "dateApplied" ? "date" : "text"} value={job[inputElement[0] as keyof Job]} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event, idx)} />
                        <br></br> 
                    </label>)
                })}
                <label className={labelSetting}>
                    Application Method/Source:
                    <select name="applicationRoute" onChange={(event: React.ChangeEvent<HTMLSelectElement>)=>handleJobUpdateInput(event, idx)}>
                    {applicationRouteArr.map(choice=>{
                        return(<option key={choice} className={inputSetting} value={choice}>{choice}</option>)
                    })}
                    </select>

                </label><br></br>

                    {/* <label className={labelSetting}>
                        Company Name:
                        <input className={inputSetting} name="company" type="text" value={job.company} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event, idx)} />
                    </label>
                    <br></br>
                    <label className={labelSetting}>
                        Job Title Name:
                        <input className={inputSetting} name="title" type="text" value={job.title} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event, idx)} />
                    </label>
                    <br></br>
                    <label className={labelSetting}>
                    Job Location:
                    <input className={inputSetting} name="location" type="text" value={job.location} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event, idx)} />
                    </label>
                    <br></br>
                    <label className={labelSetting}>
                        URL:
                        <input className={inputSetting} name="URL" type="text" value={job.URL} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event, idx)} />
                    </label> 
                    <br></br> 
                    <label className={labelSetting}>
                        Application Date:
                        <input className={inputSetting} name="dateApplied" type="date" value={job.dateApplied} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event, idx)} />
                    </label><br></br>               */}
                    <label className={labelSetting}>
                        Job Description:
                        <textarea className={inputSetting} name="jobDescription" value={job.jobDescription} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>)=>handleJobUpdateInput(event, idx)} />
                    </label>
                    </div>
                )
            })}
            </span>
                                {jobList.length >0 ? <button className={buttonSetting}>Submit Job Entries to Your Job List</button> : null}                
        </form>

        </div>
    )
  }
  