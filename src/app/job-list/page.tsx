"use client"
import React, {useContext} from "react";
import { UserContext } from "@/contexts/user.context";
import { useRouter } from "next/navigation";
import { Job } from "@/app/components/ManualJobForm";
import Link from "next/link";

async function getJobs(user_id:string) {
    const router = useRouter();
    const getReq = {
        method: "GET",
        body: JSON.stringify({user_id: user_id})
      };
    const res = await fetch('/api', getReq);
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    // Recommendation: handle errors
    if (!(res.status === 200)) {
        router.push("/job-entry");
      // This will activate the closest `error.js` Error Boundary
      throw new Error('Failed to fetch data');
      
    }
   
    return res.json();
  }

export default async function JobList() {
    const { user } = useContext(UserContext);
    let id = user?.id;
    let jobs: Job[] = []
    if (id) {
        jobs = await getJobs(id);

    }
    return(
        <>
            {jobs.length>0 && jobs.map(job=>{
                return(<div key={job.id}>
                    <Link href={`/job-list/${job.id}`}>{job.title}-{job.company}</Link>
                </div>)
            })}
        </>
    )
}
