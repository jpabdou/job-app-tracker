"use client"
import ManualJobForm from "@/app/components/ManualJobForm";

import { Job } from "../../../../types/Jobs";
import { useParams, useRouter } from 'next/navigation';
import React, { useState, useContext, useEffect } from "react";
import { UserContext } from "../../../contexts/user.context";
import NavBar from "@/app/components/NavBar";

export default function EditJobForm( ) {
  const {user, token, jobs} = useContext(UserContext)
  const defaultJob : Job | undefined = undefined
  const [editJob, setEditJob] = useState(defaultJob)

  async function getJob(user_id:string, jobId: string) {
    const getReq = {
        method: "GET",
        headers: {Authentication: `Bearer ${token}`}
      };
    const res = await fetch(`/api/jobs/read?id=${user_id}&jobid=${jobId}`, getReq);
   const job = await res.json()
    return job.data;}

    const jobId = useParams().id;
    // const {editJob} = await getJob(user?.id!, jobId);
    useEffect(()=>{
     getJob(user?.id!, jobId).then(data=>{

      setEditJob({...data, jobNumber: jobs.findIndex(job=>job.id === jobId)})})
    },[])

    return(
      <div className="m-5 text-center">
        {editJob !==undefined && <ManualJobForm editJob={editJob} jobId={jobId} /> }

      </div>
    )
}
