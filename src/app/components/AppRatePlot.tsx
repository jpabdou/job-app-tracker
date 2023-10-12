"use client"
import React, {useContext, useEffect,useState} from "react";
import dynamic from "next/dynamic";

interface props {
  data: {x: string[], y: number[]}
}

export default function AppRatePlot(props : props) {
  // passing plotData is array in the form of [{"_id": <date of week start>, "count": <application count for week>},...]
  // weeks is array in the form of [<date of week start>,...] for the past 16 weeks
    const {data} = props;
    const Plot = dynamic(()=>import("react-plotly.js"), {ssr:false,   loading: () => <p>Loading...</p>});



      const [hasMounted, setHasMounted] = useState(false);
      useEffect(() => {
        setHasMounted(true);
      }, []);
      if (!hasMounted) {
        return null;
      };

    return(
      <>
        {data.x.length >0 && <Plot
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
