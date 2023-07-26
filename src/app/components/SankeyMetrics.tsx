"use client"
import React, {useContext, useEffect,useState} from "react";
import dynamic from "next/dynamic";


interface props {
  plotData: {[key: string]: SankeyMetric[]}
}

interface SankeyMetric {_id: string, count: number, source: string, target: string}

export default function SankeyPlot(props : props) {
    const {plotData} = props;

    interface SankeyInputs {
      source: number[],
      target: number[],
      value:  number[]
    }

    let initialData : SankeyInputs  = {source:[], target:[], value: []}
    const [data, setData] = useState<SankeyInputs>(initialData);
    const Plot = dynamic(()=>import("react-plotly.js"), {ssr:false,   loading: () => <p>Loading...</p>})

    const labelMap: {[key: string]: number} = {};
    
      const appStageArr: Array<string> = ["Applied; Completed Telescreen/Coding Test", "Completed Telescreen/Coding Test; Completed Interview Round","Completed Interview Round; Hired"];
      
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

        let labels: string[] = [...labelArr];
        // hack-y way to give individual labels for with and without followup email groups on Sankey chart
        labels[0] = "Applied With Followup";
        labels[1] = "Applied Without Followup";

        const colors : string[] = ["yellow", "yellow", "blue","blue","orange", "orange", "blue", "blue", "yellow", "yellow", "orange", "orange", "blue", "blue", "green", "green", "grey", "grey",  "grey", "grey","grey", "grey","grey", "grey"];

      interface IHashMap {
          [key: string]: number
       }
 
     for (let i=0; i<labelArr.length; i++) {
      let label = labelArr[i]
          if (!(label in labelMap)) {
              labelMap[label] = i;
            }
          }
       
      useEffect(()=>{
        if (plotData.followup.length > 0 || plotData.noFollowup.length > 0){
          setData(initialData)
        for (let key in plotData) {
          let previousMap : IHashMap = {}
          let section : SankeyMetric[] = plotData[key]
          for (let point of section) {
            data.source.push(key === "followup" ? labelMap[point["source"]] : (labelMap[point["source"]])+1 )
            data.target.push(key === "followup" ? labelMap[point["target"]] : (labelMap[point["target"]])+1 )
            previousMap[point["_id"]] = data.source.length-1 
            data.value.push(point.count)
            let i: number = 0;
            while (point._id.split("; ")[0] !== appStageArr[i].split("; ")[0] ) {
              let arr : string[] = appStageArr[i].split("; ")
              if (!(appStageArr[i] in previousMap)) {
                data.source.push(key === "followup" ? labelMap[arr[0]] : labelMap[arr[0]]+1 )
                data.target.push(key === "followup" ? labelMap[arr[1]] : labelMap[arr[1]]+1 )
                previousMap[appStageArr[i]] = data.source.length-1 
                data.value.push(point.count)
              } else {
                data.value[previousMap[appStageArr[i]]] += point.count
              }
              i++
            }

          }
        }
        }
        setData({...data})}
       , [plotData])


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
         label: labels,
         color: colors
            },
        link: {
          source: data.source,
          target: data.target,
          value:  data.value
        }
      }]
      
     
      var sankeyLayout = {
        title: "Application Status Sankey",
        font: {
          size: 10
        }
      }

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
