'use client';
import React, {useState } from "react";
import axios, { AxiosError } from 'axios';

export default function JobEntry() {
    const h2Setting = "text-2xl text-left"
    const labelSetting = "w-1/3 flex flex-row justify-evenly"
    const inputSetting = "w-1/2"
    const formSetting = "w-1.0"
    const buttonSetting = "rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black"

    const currentDate = new Date().toJSON().slice(0,10);
    let initialUrlList : string[] = [];
    interface Job {"company": string, "title": string, "URL": string, "jobDescription": string, "location": string, "applicationDate": string};
    let initialManualJobInput :  Job ={"company": "", "title": "", "URL": "", "jobDescription": "", "location": "", "applicationDate": currentDate};
    let initialJobEntries : Job[] = [];

    // const [urlList, setUrlList] = useState(initialUrlList);
    const [jobList, setJobList] = useState(initialJobEntries);
    const [manualJob, setManualJob] = useState(initialManualJobInput);

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

    
    const handleChangeInput= (event: React.ChangeEvent<HTMLInputElement>) => {
        let val: string = event.target.value;
        let name: string = event.target.name;
        setManualJob({...manualJob, [name]: val});
    }

    const handleChangeText= (event: React.ChangeEvent<HTMLTextAreaElement>) => {
        let val: string = event.target.value;
        let name: string = event.target.name;
        setManualJob({...manualJob, [name]: val});
    }

    const handleJobUpdateInput= (event: React.ChangeEvent<HTMLInputElement>, index: number) => {
        let val: string = event.target.value;
        let name: string = event.target.name;
        let jobEntry: Job = jobList[index];
        jobEntry = {...jobEntry, [name]:val};
        jobList.splice(index, 1, jobEntry);
        setJobList([...jobList]);
    }

    const handleJobUpdateText= (event: React.ChangeEvent<HTMLTextAreaElement>, index: number) => {
        let val: string = event.target.value;
        let name: string = event.target.name;
        let jobEntry: Job = jobList[index];
        jobEntry = {...jobEntry, [name]:val};
        jobList.splice(index, 1, jobEntry);
        setJobList([...jobList]);
    }

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

      const inputArr: Array<string[]> = [["company","Company Name"],["title","Job Title"],["location","Job Location"],["URL","URL"],["applicationDate","Application Date"]]

    return (
        <div className={formSetting}>
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
            <form onSubmit={onSubmitManualInput}>
                <label className={labelSetting}>
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
                    <input name="applicationDate" type="date" className={inputSetting} value={manualJob.applicationDate} onChange={handleChangeInput} />
                </label><br></br>               
                <label className={labelSetting}>
                    Enter Job Description:
                    <textarea name="jobDescription" className={inputSetting} value={manualJob.jobDescription} placeholder='Enter Job Description Here' onChange={handleChangeText} />
                </label><br></br>
                <button className={buttonSetting}>Submit Job Entry</button>                
            </form>
            <br></br>
            <form className={formSetting} onSubmit={onSubmitJobList}>
            {jobList.map((job, idx)=>{
                return(            
                    <div key={idx}>
                    <h2 className={h2Setting} >Job #{idx+1}</h2>
                    <label className={labelSetting}>
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
                        <input className={inputSetting} name="applicationDate" type="date" value={job.applicationDate} onChange={(event: React.ChangeEvent<HTMLInputElement>)=>handleJobUpdateInput(event, idx)} />
                    </label><br></br>              
                    <label className={labelSetting}>
                        Job Description:
                        <textarea className={inputSetting} name="jobDescription" value={job.jobDescription} onChange={(event: React.ChangeEvent<HTMLTextAreaElement>)=>handleJobUpdateText(event, idx)} />
                    </label><br></br>
                    </div>
                )
            })}
        </form>

        </div>
    )
  }
  