"use client"
import React from "react";
interface props {
    handleFunc: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    selectVal: string,
    inputSetting: string
  }

  export default function JobStatusSelect(props: props) {
    const {handleFunc, selectVal, inputSetting} = props;
    const appStatusArr: Array<{"value": string, "text" : string, "optgroup": string}> = [
      {value: "Not Applied Yet", text: "Not Applied Yet", optgroup: "Not Applied Yet"}, 
      {value: "Applied; Awaiting Phone Screen", text: "Awaiting Phone Screen", optgroup: "Applied"}, 
      {value: "Applied; Rejected", text: "Rejected", optgroup: "Applied"}, 
      {value: "Completed Phone Screen; Awaiting Interview", text: "Awaiting Interview", optgroup: "Completed Phone Screen"}, 
      {value: "Completed Phone Screen; Rejected", text: "Rejected", optgroup: "Completed Phone Screen"}, 
      {value: "Completed Interview Round; Awaiting Next Round", text: "Awaiting Next Interview", optgroup: "Completed Interview Round"}, 
      {value: "Completed Interview Round; Rejected", text: "Rejected", optgroup: "Completed Interview Round"} , 
      {value: "Completed Interview Round; Awaiting Hiring Decision", text: "Awaiting Hiring Decision", optgroup: "Completed Interview Round"}, 
      {value: "Hired", text: "Hired", optgroup: "Hired"}];
    interface IGroupedOptions {
        [key: string]: {"value": string, "text" : string}[]
     }
    const groupedOptions: IGroupedOptions = {}

    appStatusArr.forEach((option) => {
      if (!groupedOptions[option.optgroup]) groupedOptions[option.optgroup] = [];
      groupedOptions[option.optgroup].push({
        value: option.value,
        text: option.text
      });
    });

    const renderOptions = (options: {"value": string, "text" : string}[]) => {
        return options.map(option => {
          return (
            <option key={option.value} value={option.value}>
              {option.text}
            </option>
          );
        });
      };
    return(
        <div className={inputSetting}>
                <label htmlFor="appStatus">Enter the Application Status:</label>
                    <select name="appStatus" value={selectVal} onChange={handleFunc}>
                    {Object.keys(groupedOptions).map((group, index) => {
                        return (
                        <optgroup key={index} label={group}>
                            {renderOptions(groupedOptions[group])}
                        </optgroup>
                        );
                    })}
                    </select>
        </div>
    )

  }
