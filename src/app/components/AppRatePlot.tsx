"use client"
import React, {useContext, useEffect,useState} from "react";
// import { UserContext } from "@/contexts/user.context";
import { useRouter } from "next/navigation";
// import {lineY, ruleY, plot} from "@observablehq/plot";
// import * as d3 from "d3";
import Plot from 'react-plotly.js';

interface props {
  weeks: string[] | undefined,
  plotData: {_id: string, count: number}[] | undefined
}

export default function AppRatePlot(props: props) {
    const router = useRouter();
    const {weeks, plotData} = props;
    const [data, setData] = useState<{x: string[], y: number[]}>({x:[], y:[]});




      const appStageArr: Array<string> = ["Not Applied Yet", "Applied", "Completed Phone Screen","Completed Interview Round", "Hired"];


      interface IHashMap {
          [key: string]: boolean
       }

       useEffect(()=>{
        if (plotData){
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
