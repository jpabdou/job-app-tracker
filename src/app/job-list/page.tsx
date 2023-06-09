"use client"
import React, {useContext, useEffect,useState} from "react";
import JobList from "../components/JobList";

export default function JobListings() {
    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
    return(
        <div>
            <JobList  />
        </div>
    )
}
