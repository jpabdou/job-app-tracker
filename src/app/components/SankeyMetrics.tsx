"use client"
import React, {useContext, useEffect,useState} from "react";
import { UserContext } from "@/contexts/user.context";
import { useRouter } from "next/navigation";
import { Job, JobEntry, SankeyLink, SankeyNode } from "../../../types/Jobs";

import * as d3Sankey from "d3-sankey"

export default function SankeyMetrics() {
    const { user, token, setAlertMessage, sankeyPlotData, setSankeyPlotData, jobs } = useContext(UserContext);
    const router = useRouter();

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

      const appStageArr: Array<string> = ["Not Applied Yet", "Applied", "Completed Phone Screen","Completed Interview Round", "Hired"];

    //   const appStatusGroupArr: Array<{"value": string, "text" : string, "optgroup": string}> = [
    //     {value: "Not Applied Yet", text: "Not Applied Yet", optgroup: "Not Applied Yet"}, 
    //     {value: "Completed Phone Screen; Awaiting Interview", text: "Awaiting Interview", optgroup: "Completed Phone Screen"}, 
    //     {value: "Completed Phone Screen; Rejected", text: "Rejected", optgroup: "Completed Phone Screen"}, 
    //     {value: "Completed Interview Round; Awaiting Next Round", text: "Awaiting Next Interview", optgroup: "Completed Interview Round"}, 
    //     {value: "Completed Interview Round; Rejected", text: "Rejected", optgroup: "Completed Interview Round"} , 
    //     {value: "Completed Interview Round; Awaiting Hiring Decision", text: "Awaiting Hiring Decision", optgroup: "Completed Interview Round"}, 
    //     {value: "Hired", text: "Hired", optgroup: "Hired"}];
      interface IHashMap {
          [key: string]: boolean
       }
       
      useEffect(()=>{
        getData(user!.id).then(res=>{
            let appFreqData = res.data.applicationFreq;
            // let noFollowupData = res.data.noFollowup;
            // let followupData = res.data.followup;

            // for (let entry of followupData) {
            //     let processedStrings = entry._id.split(";");
            //     if  (processedStrings[0] === "Hired") {
            //         plotData.nodes.push({name: processedStrings[0]})
            //         plotData.links.push({source: "Awaiting Hiring Decision", target: "Hired", value: entry.value})

            //     } else {

            //     }
            // }

            let obj = {}
            let stages = Object.keys(res.data)
            let values = Object.values(res.data)
        })   
    },[])

    return(null)
}
