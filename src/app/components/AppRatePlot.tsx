"use client"
import React, {useContext, useEffect,useState} from "react";
import dynamic from "next/dynamic";

interface props {
  weeks: string[],
  plotData: {_id: string, count: number}[]
}

export default function AppRatePlot(props : props) {
  // passing plotData is array in the form of [{"_id": <date of week start>, "count": <application count for week>},...]
  // weeks is array in the form of [<date of week start>,...] for the past 16 weeks
    const {weeks, plotData} = props;
    const [data, setData] = useState<{x: string[], y: number[]}>({x:[], y:[]});
    const Plot = dynamic(()=>import("react-plotly.js"), {ssr:false,   loading: () => <p>Loading...</p>});

    useEffect(()=>{
      if (plotData.length > 0){
      let i: number = 0;
      // loop to iterate over past 16 weeks date strings array (weeks) and plotData array to check if there's any missing weeks and add a 0-count if there are
      // all points from plotData added to data state where data.x is an array of date strings and data.y is an array of application count numbers
      for (let point of plotData!) {
        if (point._id !== weeks![i]){
          // if a week is not found, add missing week to data.x array and push 0 to data.y array by default
          while (point._id !== weeks![i] && i<weeks!.length) {
            data.x.push(weeks![i]);
            data.y.push(0);
            i++;
          }};
          data.x.push(point._id);
          data.y.push(point.count); 
        i++;
      };
      setData({...data})};
      }, [plotData]);


      const [hasMounted, setHasMounted] = useState(false);
      useEffect(() => {
        setHasMounted(true);
      }, []);
      if (!hasMounted) {
        return null;
      };

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
