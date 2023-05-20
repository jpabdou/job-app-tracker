"use-client"
import ManualJobForm from "@/app/components/ManualJobForm";

interface Job {company: string, title: string, URL: string, jobDescription: string, location: string, dateApplied: string, applicationRoute: string, outreachContact: string, emailFollowup: string, appStatus: string};
import { useParams, useRouter } from 'next/navigation';
import React, { useContext } from "react";
import { UserContext } from "../../../contexts/user.context";

  async function getJob(user_id:string, jobId: string) {
    
    const router = useRouter();
    const getReq = {
        method: "GET",
        body: JSON.stringify({user_id: user_id})
      };
    const res = await fetch(`/api/#${jobId}`, getReq);
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


export default async function EditJobForm( ) {
    const {user} = useContext(UserContext)
    const jobId = useParams().id;
    const {editJob} = await getJob(user?.id || "", jobId);

    return(
        < ManualJobForm editJob={editJob} jobId={jobId} />
    )
}
