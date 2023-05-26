"use client"
import React, {useContext, useEffect,useState} from "react";
import JobList from "../components/JobList";
import NavBar from "../components/NavBar";

export default function JobListings() {

    return(
        <div className="m-5 text-center">
            <NavBar />
            <JobList  />
        </div>
    )
}
