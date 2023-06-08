"use client"
import { UserContext } from "@/contexts/user.context";
import { useRouter } from "next/navigation";
import React, {useContext, useEffect,useState} from "react";
const Plot = require('react-plotly.js');

// interface props {
//   weeks: string[],
//   plotData: {_id: string, count: number}[]
// }

export default function AppRatePlot() {
    const {user, jobs, token, setAlertMessage} = useContext(UserContext);
    const [data, setData] = useState<{x: string[], y: number[]}>({x:[], y:[]});
    const [weeks, setWeeks] = useState<string[]>([])
    const [plotData, setPlotData] = useState<{_id: string, count: number}[]>([])
    const router = useRouter();

      const appStageArr: Array<string> = ["Not Applied Yet", "Applied", "Completed Phone Screen","Completed Interview Round", "Hired"];


      interface IHashMap {
          [key: string]: boolean
       }

       async function getData(user_id:string) {
        try {
            const getReq = {
                "method": "GET",
                "Content-type": "application/json",
                "headers": {"Authentication": `Bearer ${token}`}
              };
            let url : string = `/api/jobs/getCounts?id=${user_id}`
            const res = await fetch(`${url}`, getReq);
            if (!(res.status === 200)) {
              setAlertMessage({message: "Failed to fetch results.", severity: "error"})
                router.push("/");
              throw new Error('Failed to fetch results');
              
            }
            return res.json()
            
        } catch (e) {
            console.error(e)
        }
    
      }



       useEffect(()=>{
        if (jobs.length > 0 && user) {
          getData(user?.id).then(result=>{
            let plotRes:  {_id: string, count: number}[] = result.data.applicationFreq;
            setPlotData(plotRes);
            let weeksRes: string[] = result.data.weeks
            setWeeks(weeksRes)
          
          }
          )
        }
      },[jobs])

      useEffect(()=>{
        if (plotData.length > 0){
        let map : IHashMap = {}
        let i: number = 0
        for (let point of plotData!) {
          if (point._id !== weeks![i]){
                while (point._id !== weeks![i] && i<weeks!.length) {
              data.x.push(weeks![i]);
              data.y.push(0);
              i++
            }}
            data.x.push(point._id);
            data.y.push(point.count); 
          i++;
        }
        setData({...data})}
       }, [plotData])



       const [hasMounted, setHasMounted] = useState(false);
       useEffect(() => {
         setHasMounted(true);
       }, []);
       if (!hasMounted) {
         return null;
       }

    return(
      <>
        {plotData && <Plot
        data={[
          {
            x: data.x,
            y: data.y,
            type: 'scatter',
            mode: 'lines+markers',
            marker: {color: 'orange'},
          }
        ]}
        layout={ {width: 720, height: 480, title: 'Application Frequency by Week',
        xaxis: {
          title: 'Date of Week Start'
        },
        yaxis: {
          title: '# of applications/week'
        }} }
      />}
      </>

    )
}
