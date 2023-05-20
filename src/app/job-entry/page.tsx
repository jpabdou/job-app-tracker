'use client';
import React, {useState, useEffect } from "react";
import axios, { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import ManualJobForm from "@/app/components/ManualJobForm";
import JobForms from "@/app/components/JobForms";

export default function JobEntry() {
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

    const currentDate = new Date().toJSON().slice(0,10);
    let initialUrlList : string[] = [];
    interface Job {company: string, title: string, URL: string, jobDescription: string, location: string, dateApplied: string, applicationRoute: string, outreachContact: string, emailFollowup: string, appStatus: string};
    let initialManualJobInput :  Job ={company: "", title: "", URL: "", jobDescription: "", location: "", dateApplied: currentDate, applicationRoute: "Not Applied Yet", outreachContact: "", emailFollowup: "no", appStatus: "Not Applied Yet"};
    let initialJobEntries : Job[] = [];
    interface JobError {company: number[], title: number[], URL: number[], jobDescription: number[], location: number[]};
    let initialJobErrors : JobError = {company: [], title: [], URL: [], jobDescription: [], location: []};

    // const [urlList, setUrlList] = useState(initialUrlList);
    const [jobList, setJobList] = useState(initialJobEntries);

    
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
    //                 Access-Control-Allow-Origin": "*"
                    
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


    



    const handleJobUpdateInput= (event: React.ChangeEvent<HTMLInputElement> | React.ChangeEvent<HTMLSelectElement> | React.ChangeEvent<HTMLTextAreaElement> , index: number) => {
        let val: string = event.target.value;
        let name: string = event.target.name;
        let jobEntry: Job = jobList[index];
        jobEntry = {...jobEntry, [name]:val};
        jobList.splice(index, 1, jobEntry);
        setJobList([...jobList]);
    }

    const postJob = async (job: Job) => {
        try {
          const response = await axios.post("http://localhost:300/api/add", job);
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

      const requiredArr:  Array<string> = ["company", "title", "URL", "location"];
      const inputArr: Array<string[]> = [["company","Company Name"],["title","Job Title"],["location","Job Location"],["URL","URL"],["dateApplied","Application Date"]];
      const applicationRouteArr: Array<string> = ["Not Applied Yet","Company Career Site", "Referral", "LinkedIn", "Email", "Indeed", "ZipRecruiter", "AngelList", "USAJobs", "Simply Hired", "GlassDoor"];
      const appStatusArr: Array<string> = ["Not Applied Yet", "Applied; Awaiting Phone Screen", "Rejected", "Completed Phone Screen; Awaiting Technical Interview", "Completed Technical Interview Round; Awaiting Next Round", "Completed Technical Interview; Awaiting Hiring Decision", "Hired"];

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

            <ManualJobForm editJob={undefined} jobId={undefined} />
            <br></br>
            <JobForms jobList={jobList} setJobList={setJobList} />
        </div>
    )
  }
  