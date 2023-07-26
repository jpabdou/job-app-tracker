"use client"
import ManualJobForm from "@/app/components/ManualJobForm";

import { Job } from "../../../../types/Jobs";
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/user.context";

export default function EditJobForm( ) {
  const {user, token, jobs, trial} = useContext(UserContext)
  const defaultJob : Job | undefined = undefined
  const [editJob, setEditJob] = useState(defaultJob)

  async function getJob(user_id:string, jobId: string) {
    const getReq = {
        method: "GET",
        headers: {Authentication: `Bearer ${token}`}
      };
    const res = await fetch(`/api/jobs/read?id=${trial ? "6482c564b18df6bd4874cb5c" : user_id}&jobid=${jobId}`, getReq);
   const job = await res.json()
    return job.data;}

    const jobId: string = useParams().id as string;
    useEffect(()=>{
     getJob(user?.id!, jobId).then(data=>{

      setEditJob({...data, jobNumber: jobs.findIndex(job=>job.id === jobId)})})
    },[])

    return(
      <div className="my-5 text-center">
        {editJob !==undefined && <ManualJobForm editJob={editJob} jobId={jobId} /> }

      </div>
    )
}
