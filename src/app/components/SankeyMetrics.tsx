"use client"
import React, {useContext, useEffect,useState} from "react";
import dynamic from "next/dynamic";
import Plotly from "plotly.js";

interface props {
  plotData: {followup: SankeyMetric[], noFollowup: SankeyMetric[]}
}

interface SankeyMetric {_id: string, count: number}

export default function SankeyPlot(props : props) {
    const {plotData} = props;
    const [data, setData] = useState<{
      source: number[],
      target: number[],
      value:  number[]
    }>({source:[], target:[], value: []});
    const Plot = dynamic(()=>import("react-plotly.js"), {ssr:false})

    const labels: string[] =  [];
    const labelMap: {[key: string]: number} = {};
    const sankeyMap: IHashMap = {};
    const colors : string[] = [];
      const appStageArr: Array<string> = ["Applied; Awaiting Telescreen/Coding Test", "Completed Telescreen/Coding Test; Awaiting Interview","Completed Interview Round; Awaiting Hiring Decision", "Hired"];

        const appStatusArr: Array<{"value": string, "text" : string, "optgroup": string}> = [
          {value: "Applied; Awaiting Telescreen/Coding Test", text: "Awaiting Telescreen/Coding Test", optgroup: "Applied"}, 
          {value: "Applied; Rejected", text: "Rejected", optgroup: "Applied"}, 
          {value: "Applied; No Response", text: "No Response", optgroup: "Applied"}, 
          {value: "Completed Telescreen/Coding Test; Awaiting Interview", text: "Awaiting Interview", optgroup: "Completed Telescreen/Coding Test"}, 
          {value: "Completed Telescreen/Coding Test; Rejected", text: "Rejected", optgroup: "Completed Telescreen/Coding Test"}, 
          {value: "Completed Interview Round; Awaiting Next Round", text: "Awaiting Next Interview", optgroup: "Completed Interview Round"}, 
          {value: "Completed Interview Round; Rejected", text: "Rejected", optgroup: "Completed Interview Round"} , 
          {value: "Completed Interview Round; Awaiting Hiring Decision", text: "Awaiting Hiring Decision", optgroup: "Completed Interview Round"}, 
          {value: "Hired", text: "Hired", optgroup: "Hired"}];

      interface IHashMap {
          [key: string]: string[]
       }

       let followupValueMap: {
        [key: string]: number
     } = {}

       for (let stage of appStatusArr) {
        followupValueMap[stage.value] = 0
        // "Hired" is the last stage and doesn't follow the stage.optgroup = previous stage and stage.text = current stage structure
          if (stage.optgroup === "Hired") {
            if (!(stage.optgroup in labelMap)) {
              labelMap[stage.optgroup] = labels.length;
              labels.push(stage.optgroup);
              labels.push(stage.optgroup);
              colors.push("green");
              colors.push("green");
            }
            if (!("Completed Interview Round" in labelMap)) {
              labelMap["Completed Interview Round"] = labels.length;
              labels.push("Completed Interview Round");
              colors.push("blue");
              labels.push("Completed Interview Round");
              colors.push("blue");
            }
          } else {
              if (!(stage.optgroup in labelMap)) {
                labelMap[stage.optgroup] = labels.length;
                if (stage.optgroup === "Applied") {
                  labels.push("Applied with followup")                  
                  labels.push("Applied without followup")
                } else {
                labels.push(stage.optgroup);
                labels.push(stage.optgroup);}
                switch (stage.optgroup){
                  case "Applied":
                    colors.push("yellow");
                    colors.push("yellow");
                    break;
                  case "Completed Telescreen/Coding Test":
                    colors.push("orange");
                    colors.push("orange");
                    break;
                  case "Completed Interview Round":
                    colors.push("blue");
                    colors.push("blue");
                    break;
                  default:
                    break
                }
              }
              labelMap[stage.text] = labels.length;
              labels.push(stage.text);
              labels.push(stage.text);
                switch (stage.text){
                  case "Awaiting Telescreen/Coding Test":
                    colors.push("yellow");
                    colors.push("yellow");
                    break;
                  case "Rejected":
                    colors.push("red");
                    colors.push("red");
                    break;
                  case "No Response":
                    colors.push("gray");
                    colors.push("gray");
                    break;
                  case "Awaiting Hiring Decision":
                    colors.push("blue");
                    colors.push("blue");
                    break;
                  case "Awaiting Interview":
                    colors.push("orange");
                    colors.push("orange");
                    break;
                  case "Awaiting Next Round":
                    colors.push("blue");
                    colors.push("blue");

                  default:
                    break
                }
  
            }
          }
       
      const allLabels = labels.concat(labels)
      const allColors = colors.concat(colors)
      const noFollowupValueMap = {...followupValueMap}

      useEffect(()=>{
        if (plotData.followup.length > 0){
        let i: number = 0

        for (let point of plotData.followup) {
          let stageArr: string[] = point._id.split("; ");
              
              data.source.push(labelMap[stageArr[0]]);
              data.target.push(labelMap[stageArr[1]]);

                let i = 0;
                while (appStageArr[i].split("; ")[0] !== stageArr[0]) {
                  followupValueMap[appStageArr[i]] += point.count                
                  i++
                }
                followupValueMap[point._id] += point.count
            
            }
            for (let point of plotData.followup) {
                  
                  data.value.push(followupValueMap[point._id]);
                }
            for (let point of plotData.noFollowup) {
              let stageArr: string[] = point._id.split("; ");
                  
                  data.source.push(labelMap[stageArr[0]]+1);
                  data.target.push(labelMap[stageArr[1]]+1);
    
                    let i = 0;
                    while (appStageArr[i].split("; ")[0] !== stageArr[0]) {
                      noFollowupValueMap[appStageArr[i]] += point.count                
                      i++
                    }
                    noFollowupValueMap[point._id] += point.count
                
                }
                for (let point of plotData.noFollowup) {
                      
                      data.value.push(noFollowupValueMap[point._id]);
                    }
        }
        setData({...data})}
       , [plotData])


       let sankey = [{
        type: "sankey",
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
      
      // Plotly.react('myDiv', sankey, layout)
      



       const [hasMounted, setHasMounted] = useState(false);
       useEffect(() => {
         setHasMounted(true);
       }, []);
       if (!hasMounted) {
         return null;
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
