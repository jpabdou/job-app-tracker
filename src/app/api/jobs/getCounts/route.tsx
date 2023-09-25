import * as mongoDB from "mongodb";
import { NextResponse, NextRequest } from 'next/server';
const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";
// Added to ensure fetch requests are not cached. This was due to an error thrown while deploying to Vercel. 
export const revalidate = 0;

// this getCounts endpoint provides data for both application frequency counts (how many applications sent per week) and application progress count (how many applications are at each step in the application process)
// A better way to do this would be to seperate the functions and database querying for each data/results to maintain one function for one purpose. This task is on the list of tasks for the Job Application Tracker
export async function GET(request: NextRequest) {
    if (request.method === 'GET') {
    try {
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      // finds user's ID to search for jobs data through the request url's search params
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";

      // The following is the bucket allocation function that returns an array of strings corresponding to the dates of the past 16 weeks, ending at the current day the getCounts endpoint is accessed 
      // 16 weeks is arbitrary and this can be set by user query. This task is on the list of tasks for Job Application Tracker.
      const weekBuckets = () => {
        const now = new Date();
        const weekBoundaries : string[] = [] // boundaries for each bucket
        const weeksArr : number[] = []; // array of numbers corresponding days in the past needed to calculate the date of a previous week

        for (let i=0; i<=16; i++) {
          weeksArr.push(i*7);
        }
        // calculating each week start date by subtracting number of days given in the weeksArr
        for (const week of weeksArr) {
          const weekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - week).toJSON().slice(0,10);
          weekBoundaries.unshift(weekDate);
        }
        return weekBoundaries;
      }

      let weeks : string[] = weekBuckets();

      // Sequence of operations to obtain the Application Frequency data
      const pipelineAppFreq= [
        {$match: { "user_id": user_id }}, // Search for applications that match user_id
          {$bucket: {
            groupBy: "$dateApplied",                        // Group applications by dateApplied/date application was sent on
            boundaries: weeks, // Boundaries for buckets by each week (as a string)
            default: "Earlier",                             // Bucket ID for documents which do not fall into the boundaries of the past 16 weeks
            output: {                                     // Output for each bucket is the count of applications
              "count": { $sum: 1},
            }
          }},
          { $sort : { "_id" : 1 } } // Sort in increasing date order
        
      ] 

      // Connects to "jobsData" collection and performs aggregation pipeline operations following the pipelineAppFreq
      let applicationFreqResult = await db_connect
      .collection("jobsData")
      .aggregate(pipelineAppFreq)
      .toArray();

      weeks.pop(); // removes the current date from the response returned


      // The following is the querying for the counts of applications for each application status to be used in the Sankey plot
      // Two sequence of operations for the application status data for applications sent with email followup and without
      const pipelineFollowup=[
        { $match: { "emailFollowup": "yes", "user_id": user_id , "appStatus": {$ne: "Not Applied Yet"}} },  // Search for job applications matching user_id with email followups sent, removing unsent job applications 
        { $group: { _id: "$appStatus", count: { $sum: 1 } } },       // Group results by appStatus/application status ("Applied; Waiting for Response", "Applied; Rejected", etc.) and count each application in a group.
        {$sort: { "appStatus": 1}}      // Sort results by appStatus/application status in alphabetical order.
      ]

      const pipelineNonFollowup = [
        { $match: { "emailFollowup": "no", "user_id": user_id , "appStatus": {$ne: "Not Applied Yet"}} },  // Search for job applications matching user_id without email followups sent, removing unsent job applications 
        { $group: { _id: "$appStatus", count: { $sum: 1 } } },       // Group results by appStatus/application status ("Applied; Waiting for Response", "Applied; Rejected", etc.) and count each application in a group.
        {$sort: { "appStatus": 1}}      // Sort results by appStatus/application status in alphabetical order.
      ]


      // Connects to "jobsData" collection and performs aggregation pipeline operations following the pipelineFollowup
      let followupResult = await db_connect
        .collection("jobsData")
        .aggregate(pipelineFollowup)
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
      
        // Same logic and operations as followupResult. This likely should be refactored through for loop and is on the list of tasks for the Job Application Tracker
        let nonFollowupResult = await db_connect
        .collection("jobsData")
        .aggregate(pipelineNonFollowup)
        .map((statusCount)=>{
          let arr = statusCount._id.split("; ");

            statusCount["source"] = arr[0]

          if (arr[1] === "Rejected") {
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
            statusCount["target"] = arr[1]
          }
          
          return statusCount
        })
        .toArray();

        // returns response of the weeks string array, the application frequency count results, and the application status counts results
        return NextResponse.json({data:{noFollowup: nonFollowupResult, followup: followupResult, applicationFreq: applicationFreqResult, weeks: weeks}});

      
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: e});
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"});
    }
    }
