"use client"
import React, {useContext, useEffect,useState} from "react";
import { UserContext } from "@/contexts/user.context";
import { useRouter } from "next/navigation";
import { Job } from "../../../types/Jobs";
import Link from "next/link";

export default function JobList() {
    const { user, token } = useContext(UserContext);
    const router = useRouter();


    let id = user?.id;
    const jobArr : Job[] = []
    const [jobs, setJobs] = useState(jobArr);

    async function getJobs(user_id:string) {
        try {
            const getReq = {
                "method": "GET",
                "Content-type": "application/json",
                "headers": {"Authentication": `Bearer ${token}`}
              };
            const res = await fetch(`/api/jobs/read?id=${user_id}`, getReq);
            // The return value is *not* serialized
            // You can return Date, Map, Set, etc.
           
            // Recommendation: handle errors
            if (!(res.status === 200)) {
                router.push("/job-entry");
              // This will activate the closest `error.js` Error Boundary
              throw new Error('Failed to fetch data');
              
            }
            let result = await res.json(); 
            setJobs(result.data);
        } catch (e) {
            console.error(e)
        }

      }

    useEffect(()=>{
        if (id) {
            getJobs(id)
    
    
        } else {
            router.push("/login")
            alert("Not Logged In")
            
        }
    },[])

    return(
        <div>
            {jobs.length>0 && jobs.map(job=>{
                return(
                <div key={job._id.toString()}>
                    <Link href={`/job-list/${job._id.toString()}`}>{job.title}-{job.company}</Link>
                </div>)
            })}
        </div>
    )
}
