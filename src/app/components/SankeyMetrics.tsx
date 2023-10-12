"use client"
import React, {useContext, useEffect,useState} from "react";
import dynamic from "next/dynamic";
import { SankeyMetric, SankeyInputs } from "../../../types/Jobs";

interface props {
  data: SankeyInputs,
  colors: string[],
  labels: string[]
};

interface IHashMap {
  [key: string]: number
};

export default function SankeyPlot(props : props) {
    const {data, colors, labels} = props;

    const Plot = dynamic(()=>import("react-plotly.js"), {ssr:false,   loading: () => <p>Loading...</p>});
    
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
      link: {...data}
    }];
    
    
    var sankeyLayout = {
      title: "Application Status Sankey",
      font: {
        size: 10
      }
    };

    return(
      <div id="myDiv">
        {(data.value.length > 0) ?	

        <Plot
        data={sankey}
        layout={sankeyLayout}
      /> : null
      }
      </div>

    )
}
