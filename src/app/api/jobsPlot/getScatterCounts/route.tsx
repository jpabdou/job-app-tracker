import * as mongoDB from "mongodb";
import { NextResponse, NextRequest } from 'next/server';
const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";
// Added to ensure fetch requests are not cached. This was due to an error thrown while deploying to Vercel. 
export const revalidate = 0;

// this getScatterCounts endpoint provides data for application frequency counts (how many applications sent per week) for scatter plot of number of applications per week
export async function GET(request: NextRequest) {
    if (request.method === 'GET') {
    try {
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      // finds user's ID to search for jobs data through the request url's search params
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";

      // The following is the bucket allocation function that returns an array of strings corresponding to the dates of the past 16 weeks, ending at the current day the getScatterCounts endpoint is accessed 
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


      let data: {x: string[], y: number[]}= {x:[], y:[]}
      let i: number = 0;
      // loop to iterate over past 16 weeks date strings array (weeks) and plotData array to check if there's any missing weeks and add a 0-count if there are
      // all points from plotData added to data state where data.x is an array of date strings and data.y is an array of application count numbers
      for (let point of applicationFreqResult) {
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

        // returns response of the weeks string array, the application frequency count results, and the application status counts results
        return NextResponse.json({data: data});

      
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: e});
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"});
    }
    }
