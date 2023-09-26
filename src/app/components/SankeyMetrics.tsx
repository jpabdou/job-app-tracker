"use client"
import React, {useContext, useEffect,useState} from "react";
import dynamic from "next/dynamic";


interface props {
  plotData: {[key: string]: SankeyMetric[]}
};

interface SankeyMetric {_id: string, count: number, source: string, target: string};

interface SankeyInputs {
  source: number[],
  target: number[],
  value:  number[]
};

interface IHashMap {
  [key: string]: number
};

export default function SankeyPlot(props : props) {
    const {plotData} = props;

    let initialData : SankeyInputs  = {source:[], target:[], value: []};
    const [data, setData] = useState<SankeyInputs>(initialData);
    const Plot = dynamic(()=>import("react-plotly.js"), {ssr:false,   loading: () => <p>Loading...</p>});

    
    // array of the implicit stages in the job application process: Applied -> Completed Telescreen/Coding Test -> Completed Interview Round -> Hired
    // used to back-calculate counts for earlier stages, ex. count of "Completed Interview Round" applications should be added to "Applied" and "Completed Telescreen/Coding Test" rounds
    const appStageArr: Array<string> = ["Applied; Completed Telescreen/Coding Test", "Completed Telescreen/Coding Test; Completed Interview Round","Completed Interview Round; Hired"];
    
    // Array of all labels to be used in the Sankey plot. Each label written twice for data for applications sent with email followup and without email followup
    const labelArr : string[] = ["Applied", "Applied", 
    "Awaiting Hiring Decision", "Awaiting Hiring Decision",
    "Awaiting Interview", "Awaiting Interview", 
    "Awaiting Next Interview", "Awaiting Next Interview",
    "Awaiting Telescreen/Coding Test", "Awaiting Telescreen/Coding Test", 
    "Completed Telescreen/Coding Test", "Completed Telescreen/Coding Test", 
    "Completed Interview Round", "Completed Interview Round", 
    "Hired", "Hired", 
    "No Response","No Response",
    "Rejected at App","Rejected at App",  
    "Rejected at Interview","Rejected at Interview", 
    "Rejected at Screen","Rejected at Screen"];

    // Array of all colors to be used in the Sankey plot, corresponding to labelArr. Each color written twice for data for applications sent with email followup and without email followup
    const colorArr : string[] = ["yellow", "yellow", "blue","blue","orange", "orange", "blue", "blue", "yellow", "yellow", "orange", "orange", "blue", "blue", "green", "green", "grey", "grey",  "grey", "grey","grey", "grey","grey", "grey"];

    // map for corresponding indices of labelArr and colorArr for each stage in the application process 
    const labelMap: IHashMap = {};

    for (let i=0; i<labelArr.length; i++) {
        let label = labelArr[i];
        if (!(label in labelMap)) {
            labelMap[label] = i;
          };
        };

    // Set individual labels for application with and without followup email groups on Sankey plot so users can differentiate between application progress 
    labelArr[0] = "Applied With Followup";
    labelArr[1] = "Applied Without Followup";

    useEffect(()=>{
      if (plotData.followup.length > 0 || plotData.noFollowup.length > 0){
        setData(initialData);
        // iterate through each key of plotData in the form of {"followup": [data], "noFollowup": [data]}
        for (let key in plotData) {
          // maps all steps in the application process and tracks their corresponding index value within data object source, target, and values arrays
          let previousMap : IHashMap = {};

          // dataArr is an array of SankeyMetric objects with each SankeyMetric following the template: {
          //  "_id": string of job step in the form of <current status for user>; <resulting status from company> (ex. Applied; Rejected), 
          // "count": number of applications found for a given "_id"},
          // "source": string of <current status for user> within _id,
          // "target": string of <resulting status from company> within _id with modifications for the Rejected outcomes to differentiate between what step the rejection was received at}
          let dataArr : SankeyMetric[] = plotData[key];
          // iterates over each SankeyMetric point within plotData[key]
          for (let point of dataArr) {
            // push the index within labelArr and colorArr for the current step to data.source and data.target arrays. Index found using labelMap. 
            data.source.push(key === "followup" ? labelMap[point["source"]] : (labelMap[point["source"]])+1);
            data.target.push(key === "followup" ? labelMap[point["target"]] : (labelMap[point["target"]])+1);
            // push the "count" value to data.value array
            data.value.push(point.count);
            // Adds the current job step (_id) to previousMap and save the index within data[source]/data[target] as the value
            previousMap[point["_id"]] = data.source.length-1;
            // while loop to iterate through previous steps and add counts to them for job steps later in the application process
            // solves the issue where "Completed Interview Round; Hired" count is not added to "Applied" and subsequent steps
            let i: number = 0;
            while (point._id.split("; ")[0] !== appStageArr[i].split("; ")[0] ) {
              let arr : string[] = appStageArr[i].split("; ");
              if (!(appStageArr[i] in previousMap)) {
                data.source.push(key === "followup" ? labelMap[arr[0]] : labelMap[arr[0]]+1 );
                data.target.push(key === "followup" ? labelMap[arr[1]] : labelMap[arr[1]]+1 );
                previousMap[appStageArr[i]] = data.source.length-1; 
                data.value.push(point.count);
              } else {
                data.value[previousMap[appStageArr[i]]] += point.count;
              };
              i++;
            };

          };
        };
      };
      setData({...data})}
      , [plotData]);


      let sankey = [{
      type: 'sankey' as const,
      name: "Application Status Sankey",
      orientation: 'h' as const,
      node: {
        pad: 15,
        thickness: 30,
        line: {
          color: "black",
          width: 0.5
        },
        label: labelArr,
        color: colorArr
          },
      link: {
        source: data.source,
        target: data.target,
        value:  data.value
      }
    }];
    
    
    var sankeyLayout = {
      title: "Application Status Sankey",
      font: {
        size: 10
      }
    };

    return(
      <div id="myDiv">
        {((plotData.followup.length + plotData.noFollowup.length) >0) ?	

        <Plot
        data={sankey}
        layout={sankeyLayout}
      /> : null
      }
      </div>

    )
}
