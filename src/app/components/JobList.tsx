"use client"
import React, {useContext, useEffect,useState} from "react";
import { UserContext } from "@/contexts/user.context";
import { useRouter } from "next/navigation";
import { Job, JobEntry, SankeyInputs } from "../../../types/Jobs";
import JobRowSmall from "./JobRowSmall";
import JobRow from "./JobRow";
import { Table, TableRow, TableHead, TableCell, TableBody, Box, TablePagination } from "@mui/material";
import AppRatePlot from "./AppRatePlot";
import SankeyPlot from "./SankeyMetrics";
import ManualJobForm from "./ManualJobForm";

export default function JobList() {
    const { user, token, setAlertMessage, jobs, setJobs, trial, editJobNumber, setEditJobNumber } = useContext(UserContext);
    const router = useRouter();
    const [editJob, setEditJob] = useState(false);

    const [filteredJobs, setFilteredJobs] = useState(jobs);

    const initialFilterEntry = {filterKey: "title", filterTerm: ""};
    const [filterEntry, setFilterEntry] = useState(initialFilterEntry);
    const [filterSetting,setFilterSetting] = useState(initialFilterEntry);

    const currentDate = new Date().toJSON().slice(0,10);
    const [massUpdate, setMassUpdate] = useState(currentDate);

    const filterArr: string[] = ["company", "title", "dateApplied", "emailFollowup", "appStatus"];
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
    const [revealData, setRevealData] = useState(false);

    const [scatterData, setScatterData] = useState<{x: string[], y: number[]}>({x: [], y: []});

    let initialData : SankeyInputs  = {source:[], target:[], value: []};
    const [sankeyData, setSankeyData] = useState<{data: SankeyInputs, colors: string[], labels: string[]}>({data: {...initialData}, colors: [], labels: []})

    const buttonSetting = "w-auto mx-5 rounded-md border-2 p-3 border-black object-left bg-lime-700 text-white hover:bg-lime-200 hover:text-black";
    
    const handleUpdateChange =(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)=>{
      const {value} = e.target;
      setMassUpdate(value);
    }

    const submitUpdate = (e: React.ChangeEvent<HTMLFormElement>) =>{
      e.preventDefault();
      updateJobsNoResponse().then(res=>{
        jobs.forEach(ele=>{
          if (ele.dateApplied < massUpdate && ele.appStatus === "Applied; Awaiting Telescreen/Coding Test") {
            ele.appStatus = "Applied; No Response"
          }
        })
        setJobs([...jobs])
        setMassUpdate(currentDate);
        router.refresh();
      })

      
    }

    const handleChange =(e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>)=>{
      const {name, value} = e.target;
      setFilterEntry({...filterEntry, [name]: value});
    }

    const submit = (e: React.ChangeEvent<HTMLFormElement>) =>{
      e.preventDefault();
      setFilterSetting(filterEntry);
    }

    async function getJobs(user_id:string) {
      try {
          const getReq = {
              "method": "GET",
              "Content-type": "application/json",
              "headers": {"Authentication": `Bearer ${token}`}
            };
          let url : string = `/api/jobs/read?id=${user_id}`
          const res = await fetch(`${url}`, getReq);
          if (!(res.status === 200)) {
            setAlertMessage({message: "Failed to fetch data.", severity: "error"})
              router.push("/");
            throw new Error('Failed to fetch data');
            
          }
          return res.json();
          
      } catch (e) {
          console.error(e);
      };
  
    };

    useEffect(()=>{

        if (user){
          setEditJobNumber(null);
          setEditJob(false);
          getJobs(trial ? "6482c564b18df6bd4874cb5c" : user?.id).then(result=>{
            if (result.data.length === 0) {
              setEditJob(true);
              setAlertMessage({message: "No jobs found. Submit a job first.", severity: "error"});
            }
            else{
              let results: Job[] = result.data;
            setJobs(results);
            setFilteredJobs(results);
          }
          }
          )
        } else {
            router.push("/login");
            setAlertMessage({message:"Not Logged In.", severity: "error"});        
        
    }
  },[]);


  async function getScatterData(user_id:string) {
    try {
        const getReq = {
            "method": "GET",
            "Content-type": "application/json"
          };
        let url : string = `/api/jobsPlot/getScatterCounts?id=${user_id}`
        const res = await fetch(`${url}`, getReq);
        if (!(res.status === 200)) {
          setAlertMessage({message: "Failed to fetch results.", severity: "error"});
            router.push("/");
          throw new Error('Failed to fetch results');
          
        }
        return res.json();
        
    } catch (e) {
        console.error(e);
    };

  };

  async function getSankeyData(user_id:string) {
    try {
        const getReq = {
            "method": "GET",
            "Content-type": "application/json"
          };
        let url : string = `/api/jobsPlot/getSankeyCounts?id=${user_id}`
        const res = await fetch(`${url}`, getReq);
        if (!(res.status === 200)) {
          setAlertMessage({message: "Failed to fetch results.", severity: "error"})
            router.push("/");
          throw new Error('Failed to fetch results');
          
        }
        return res.json()
        
    } catch (e) {
        console.error(e);
    };

  };



   useEffect(()=>{
    if (jobs.length > 0 && user) {

      getScatterData(trial ? "6482c564b18df6bd4874cb5c" : user?.id).then(result=>{
        setScatterData(result.data)     
      }
      )
      getSankeyData(trial ? "6482c564b18df6bd4874cb5c" : user?.id).then(result=>{
        setSankeyData(result.data)     
      }
      )
      
    }
  },[revealData])

  useEffect(()=>{
    setEditJob(typeof editJobNumber=== "number")
    if (editJob) setRevealData(false)
    setFilteredJobs(jobs)
  },[editJobNumber])

  
  const updateJobsNoResponse = async () => {
    const updateReq = {
        "method": "PUT",
        "body": JSON.stringify({weekDate: massUpdate}),
        'Content-Type': 'application/json',
        "headers": {"Authentication": `Bearer ${token}`}
    };
    try {
        let url :string = `/api/jobs/updateNoResponses?id=${user?.id}`

      const response = await fetch(url, updateReq);
      let job = await response.json();
      return job;
    } catch (error) {
                  console.error('unexpected error: ', error);
            return 'An unexpected error occurred';
               
        }
  };
  

    const handleChangePage = (event: unknown, newPage: number) => {
      setPage(newPage);
    };
  
    const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
      setRowsPerPage(parseInt(event.target.value, 10));
      setPage(0);
    };

    const emptyRows =
    page > 0 ? Math.max(0, (1 + page) * rowsPerPage - jobs.length) : 0;

  const visibleRows = React.useMemo(
    () =>{
      return filteredJobs
      .filter((job)=>job[filterSetting.filterKey as keyof Job].toLocaleLowerCase('en-US').includes(filterSetting.filterTerm.toLocaleLowerCase('en-US')))
      .slice(
        page * rowsPerPage,
        (page+1) * rowsPerPage,
      )},
    [ filteredJobs, filterSetting ,page, rowsPerPage]
  );


    const [hasMounted, setHasMounted] = useState(false);
    useEffect(() => {
      setHasMounted(true);
    }, []);
    if (!hasMounted) {
      return null;
    }
    

    return(
      <>
        {!editJob && <div className="flex flex-col flex-wrap align-evenly justify-evenly">
          {trial && <h1 className="text-3xl font-bold text-center">Do note that trial data cannot be modified on the server and is for demonstration purposes only. The App Frequency plot does not reflect user changes as well.</h1>}
          <div className="flex flex-row justify-center">
            <button className={buttonSetting} onClick={()=>{setEditJob(true)}}>Submit a New Job Application</button>
            <button className={buttonSetting} onClick={()=>{setRevealData(!revealData)}}>Display Job Progress Plots</button>
          </div>
          <div className="my-2 self-center">
          {revealData && <AppRatePlot data={scatterData} />}
          {revealData && <SankeyPlot {...sankeyData} />}
          <form className="flex flex-row flex-wrap align-evenly justify-evenly" onSubmit={submitUpdate}>
            <input name="dateFilter" className="mx-2" value={massUpdate} onChange={handleUpdateChange} type="date" />
            <button className="underline font-bold mx-2">{`Set all Awaiting Telescreen/Coding Test posts before ${massUpdate} as No Response`}</button>
          </form>

          </div>
          <div className="flex flex-row justify-center">
          <form onSubmit={submit}>
            Filter by 
            <select value={filterEntry.filterKey} className="mx-2" name="filterKey" onChange={handleChange}>
              {filterArr.map(ele=>{return(<option key={ele} value={ele}>{ele}</option>)})}
            </select> for 
            <input name="filterTerm" className="mx-2" value={filterEntry.filterTerm} onChange={handleChange} type={filterEntry.filterKey === "dateApplied" ? "date" : "text"} />
            <button className='border-spacing-2 border-black mx-2 underline'>Filter</button>
          </form>
          <button className="underline mx-2" onClick={()=>{setFilterSetting(initialFilterEntry)}}>Reset Filter</button>
          </div>
        </div>}
        {editJob && <ManualJobForm />}
        <Box sx={{ display: { xs: 'none', sm:'none', md: 'none', lg: 'block', xl:'block'}}}>
        <Table style={{ width: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow key={'header row'}>                        
                            <TableCell scope="row" sx={{fontSize: 18, fontWeight:'bold'}}>Job Title &#8211; Company
                            <br></br>
                            {"(Click to Edit Job)"}
                            </TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Date Applied                            
                            <br></br>
                            {"(YYYY-MM-DD format)"}</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Application Route</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Followed up by Email?</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Outreach Contact</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Application Status</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Update Job?</TableCell>
                        </TableRow>
                    </TableHead>
            <TableBody>          
            {jobs.length >0 ?
            visibleRows.map((job)=>{
              return(<JobRow key={job.id!} jobNumber={job.jobNumber} jobId={job.id!} />)
            })
          : 
            <TableRow
            key="not-available"
            sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
          >
            <TableCell colSpan={7}>Loading...</TableCell>
          </TableRow>}
          
          {emptyRows > 0 && (
                <TableRow                   
                style={{
                  height: 53 * emptyRows,
                }}>
                  <TableCell colSpan={7} />
                </TableRow>
              )}
              </TableBody>
            </Table>
            <TablePagination 
              rowsPerPageOptions={[5, 10, 25]}
              component="div"
              count={filteredJobs.length}
              rowsPerPage={rowsPerPage}
              page={page}
              onPageChange={handleChangePage}
              onRowsPerPageChange={handleChangeRowsPerPage}
            />
        </Box>
        <Box sx={{ display: { xs: 'block', sm:'block', md: 'block', lg: 'none', xl:'none'}}}>
        <Table style={{ width: '100%' }} aria-label="simple table">
                    <TableHead>
                        <TableRow key={'header row'}>                        
                            <TableCell scope="row" sx={{fontSize: 18, fontWeight:'bold'}}>Job Title - Company</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Date Applied</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Application Status</TableCell>
                            <TableCell align="center" sx={{fontSize: 18, fontWeight:'bold'}}>Update Job?</TableCell>
                        </TableRow>
                    </TableHead>
                    {jobs.length >0 ? visibleRows.map((job,idx)=>{
                return(
                  <JobRowSmall key={job.id!} jobNumber={job.jobNumber} jobId={job.id!} />
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
          </TableRow>
          </TableBody>}
            </Table>
            <TablePagination 
          rowsPerPageOptions={[5, 10, 25]}
          component="div"
          count={filteredJobs.length}
          rowsPerPage={rowsPerPage}
          page={page}
          onPageChange={handleChangePage}
          onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
      </>

    )
}
