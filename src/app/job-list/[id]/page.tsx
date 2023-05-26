"use client"
import ManualJobForm from "@/app/components/ManualJobForm";

import { Job } from "../../../../types/Jobs";
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/user.context";
import NavBar from "@/app/components/NavBar";

export default function EditJobForm( ) {
  const {user, token} = useContext(UserContext)
  const defaultJob : Job | undefined = undefined
  const [editJob, setEditJob] = useState(defaultJob)
  async function getJob(user_id:string, jobId: string) {
    
    
    // const router = useRouter();
    const getReq = {
        method: "GET",
        headers: {Authentication: `Bearer ${token}`}
      };
    const res = await fetch(`/api/jobs/read?id=${user_id}#${jobId}`, getReq);
    // The return value is *not* serialized
    // You can return Date, Map, Set, etc.
   
    // Recommendation: handle errors
    // if (!(res.status === 200)) {
    //     router.push("/job-entry");
    //   // This will activate the closest `error.js` Error Boundary
    //   throw new Error('Failed to fetch data');
      
    // }
   const job = await res.json()
    return job.data[0];}

    const jobId = useParams().id;
    // const {editJob} = await getJob(user?.id!, jobId);
    useEffect(()=>{
     getJob(user?.id!, jobId).then(data=>{
      console.log(data)
      setEditJob(data)})
    },[])

    return(
      <div className="m-5 text-center">
        <NavBar />
        {editJob !==undefined && <ManualJobForm editJob={editJob} jobId={jobId} /> }

      </div>
    )
}
