'use client';
import React, {useState, useEffect } from "react";
import ManualJobForm from "@/app/components/ManualJobForm";
// import JobForms from "@/app/components/JobForms";
import { Job } from "../../../types/Jobs";

export default function JobEntry() {

    return (
        <div className="w-full text-center">
            <ManualJobForm editJob={undefined} jobId={undefined} />
            <br></br>
        </div>
    )
  }
  