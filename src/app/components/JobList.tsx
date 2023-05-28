"use client"
import React, {useContext, useEffect,useState} from "react";
import { UserContext } from "@/contexts/user.context";
import { useRouter } from "next/navigation";
import { Job } from "../../../types/Jobs";
import Link from "next/link";
import JobCard from "./JobEntry";
import { Table, TableRow, TableHead, TableCell, TableBody, Box } from "@mui/material";

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
            if (result.data.length === 0) {
                router.push("/job-entry")
                alert("No jobs found. Enter a job first.")
            }
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

    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
 
    return(
        <Box sx={{ display: { xs: 'none', sm:'none', md: 'none', lg: 'block', xl:'block'}}}>
        <Table style={{ width: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow key={'header row'}>                        
                            <TableCell className="text-xl font-bold">Job Title - Company</TableCell>
                            <TableCell align="center" className="text-xl font-bold">Date Applied</TableCell>
                            <TableCell align="center" className="text-xl font-bold">Application Route</TableCell>
                            <TableCell align="center" className="text-xl font-bold">Followed up by Email?</TableCell>
                            <TableCell align="center" className="text-xl font-bold">Outreach Contact</TableCell>
                            <TableCell align="center" className="text-xl font-bold">Application Status</TableCell>
                            <TableCell align="center" className="text-xl font-bold">Update Job?</TableCell>
                        </TableRow>
                    </TableHead>
            {jobs.length>0 ? jobs.map((job,idx)=>{
                return(
                    <JobCard key={idx} editJob={job} setJobs={setJobs} jobs={jobs} idx={idx} jobId={job._id.toString()} />
                )
            }) : 
            <TableBody>

            <TableRow
            key="not-available"
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell scope="row">No Jobs Found</TableCell>
            <TableCell align="center">N/A</TableCell>
            <TableCell align="center">N/A</TableCell>
            <TableCell align="center">N/A</TableCell>
            <TableCell align="center">N/A</TableCell>
            <TableCell align="center">N/A</TableCell>
            <TableCell align="center">N/A</TableCell>
            <TableCell align="center">N/A</TableCell>
          </TableRow>
          </TableBody>}
            </Table>
        </Box>

    )
}
