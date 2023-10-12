import * as mongoDB from "mongodb";
import { NextResponse, NextRequest } from 'next/server';
const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";
import { SankeyInputs, SankeyMetric } from "../../../../../types/Jobs";
// Added to ensure fetch requests are not cached. This was due to an error thrown while deploying to Vercel. 
export const revalidate = 0;

interface IHashMap {
    [key: string]: number
  };

// this getSankeyCounts endpoint provides data for application progress count (how many applications are at each step in the application process) for Sankey plot
export async function GET(request: NextRequest) {
    if (request.method === 'GET') {
    try {
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      // finds user's ID to search for jobs data through the request url's search params
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";



      // The following is the querying for the counts of applications for each application status to be used in the Sankey plot
      // Two sequence of operations for the application status data for applications sent with email followup and without
      const pipelineFollowup=[
        { $match: { "emailFollowup": "yes", "user_id": user_id , "appStatus": {$ne: "Not Applied Yet"}} },  // Search for job applications matching user_id with email followups sent, removing unsent job applications 
        { $group: { _id: "$appStatus", count: { $sum: 1 } } },       // Group results by appStatus/application status ("Applied; Waiting for Response", "Applied; Rejected", etc.) and count each application in a group.
        { $sort: { "appStatus": 1}}      // Sort results by appStatus/application status in alphabetical order.
      ];

      const pipelineNonFollowup = [
        { $match: { "emailFollowup": "no", "user_id": user_id , "appStatus": {$ne: "Not Applied Yet"}} },  // Search for job applications matching user_id without email followups sent, removing unsent job applications 
        { $group: { _id: "$appStatus", count: { $sum: 1 } } },       // Group results by appStatus/application status ("Applied; Waiting for Response", "Applied; Rejected", etc.) and count each application in a group.
        { $sort: { "appStatus": 1}}      // Sort results by appStatus/application status in alphabetical order.
      ];

        // array of object key values
        let keyObj: {[key: string]: any[]} = {"followupResult": pipelineFollowup, "noFollowupResult": pipelineNonFollowup};

      let responseData : {[key: string]: mongoDB.BSON.Document[]} = {};

      for (let key in keyObj) {
        responseData[key] = await db_connect
        .collection("jobsData")
        .aggregate(keyObj[key])
        .map((statusCount)=>{
          // maps each job status group, which is an object, and modifies the resulting object
          // First splits job status _id string, which are in the form of "<current status for user>; <resulting status of company>", ex. "Completed Interview Round; Awaiting Hiring Decision"
          let arr = statusCount._id.split("; ");

          // creates new key called "source" and sets value to index 0 in array of job status, the current status for user
          // "source" is used in Sankey plot to determine the starting state for a given flow, ex. "Completed Interview Round" ("source") -> "Awaiting Hiring Decision"
            statusCount["source"] = arr[0];

          // creates new key called "target" and sets value to index 1 in array of job status, the resulting status of company
          // "target" is used in Sankey plot to determine the ending state for a given flow, ex. "Completed Interview Round" -> "Awaiting Hiring Decision" ("target")       
          if (arr[1] === "Rejected") {
            // if index 1 in array of job status is equal to Rejected, the results need to differentiate where in the application process the application was rejected to indicate which source-target flow is which
            switch (arr[0]) {
              case "Applied":
                statusCount["target"] = "Rejected at App";
                break;
              case "Completed Telescreen/Coding Test":
                statusCount["target"] = "Rejected at Screen";
                break;
              case "Completed Interview Round":
                statusCount["target"] = "Rejected at Interview";
                break;
            }

          } else {
            // if index 1 in array of job status is not equal to Rejected, then the "target" value is set to index 1 in array of job status with no modification
            statusCount["target"] = arr[1]
          }
          
          return statusCount
        })
        .toArray();

        
      };

      let data : SankeyInputs = {source:[], target:[], value: []};

        // array of the implicit stages in the job application process: Applied -> Completed Telescreen/Coding Test -> Completed Interview Round -> Hired
        // used to back-calculate counts for earlier stages, ex. count of "Completed Interview Round" applications should be added to "Applied" and "Completed Telescreen/Coding Test" rounds
        const appStageArr: Array<string> = ["Applied; Completed Telescreen/Coding Test", "Completed Telescreen/Coding Test; Completed Interview Round","Completed Interview Round; Hired"];
        
        // Array of all labels to be used in the Sankey plot. Each label written twice for data for applications sent with email followup and without email followup
        const labels : string[] = ["Applied", "Applied", 
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
        const colors : string[] = ["yellow", "yellow", "blue","blue","orange", "orange", "blue", "blue", "yellow", "yellow", "orange", "orange", "blue", "blue", "green", "green", "grey", "grey",  "grey", "grey","grey", "grey","grey", "grey"];

        // map for corresponding indices of labelArr and colorArr for each stage in the application process 
        const labelMap: IHashMap = {};

        for (let i=0; i<labels.length; i++) {
            let label = labels[i];
            if (!(label in labelMap)) {
                labelMap[label] = i;
            };
            };

        // Set individual labels for application with and without followup email groups on Sankey plot so users can differentiate between application progress 
        labels[0] = "Applied With Followup";
        labels[1] = "Applied Without Followup";

        // iteration to add counts for later job application steps to past application steps
        // in truth, a better implementation would be to store an array of changes to application status with their corresponding time of the status change on MongoDB
      if (responseData.followupResult.length > 0 || responseData.nonFollowupResult.length > 0){
        for (let key in responseData) {
          // maps all steps in the application process and tracks their corresponding index value within data object source, target, and values arrays
          let previousMap : IHashMap = {};

          // dataArr is an array of SankeyMetric objects with each SankeyMetric following the template: {
          //  "_id": string of job step in the form of <current status for user>; <resulting status from company> (ex. Applied; Rejected), 
          // "count": number of applications found for a given "_id"},
          // "source": string of <current status for user> within _id,
          // "target": string of <resulting status from company> within _id with modifications for the Rejected outcomes to differentiate between what step the rejection was received at}
          let dataArr = responseData[key];
          // iterates over each SankeyMetric point within plotData[key]
          for (let point of dataArr) {
            // push the index within labelArr and colorArr for the current step to data.source and data.target arrays. Index found using labelMap. 
            data.source.push(key === "followupResult" ? labelMap[point["source"]] : (labelMap[point["source"]])+1);
            data.target.push(key === "followupResult" ? labelMap[point["target"]] : (labelMap[point["target"]])+1);
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
                data.source.push(key === "followupResult" ? labelMap[arr[0]] : labelMap[arr[0]]+1 );
                data.target.push(key === "followupResult" ? labelMap[arr[1]] : labelMap[arr[1]]+1 );
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

        // returns response of the weeks string array, the application frequency count results, and the application status counts results
        return NextResponse.json({data: {data, colors, labels}});

      
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: e});
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"});
    }
    }
