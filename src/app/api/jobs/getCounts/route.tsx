import * as mongoDB from "mongodb";
import { NextResponse, NextRequest } from 'next/server';
const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";

export async function GET(request: NextRequest) {
    if (request.method === 'GET') {
    try {
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";

      const pipelineFollowup=[
        { $match: { emailFollowup: "yes", "user_id": user_id } },
        { $group: { _id: "$appStatus", count: { $sum: 1 } } }
      ]

      const pipelineNonFollowup = [
        { $match: { emailFollowup: {$eq: "no"},  "user_id": {$eq: user_id}, "appStatus": {$ne: "Not Applied Yet"}} },
        { $group: { _id: "$appStatus", count: { $sum: 1 } } },
        {$sort: { "appStatus": 1}}
      ]

      const now = new Date();
      const currentDate = now.toJSON().slice(0,10);
      const weekBoundaries : string[] = []
      const weeksArr : number[] = [];
      for (let i=0; i<=16; i++) {
        weeksArr.push(i*7)
      }

      for (const week of weeksArr) {
        const weekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - week).toJSON().slice(0,10);
        weekBoundaries.unshift(weekDate)
      }

      const pipelineAppFreq= [
        {$match: { "user_id": user_id }},
          {$bucket: {
            groupBy: "$dateApplied",                        // Field to group by
            boundaries: weekBoundaries, // Boundaries for the buckets
            default: "Earlier",                             // Bucket ID for documents which do not fall into a bucket
            output: {                                     // Output for each bucket
              "count": { $sum: 1},
            }
          }},
          { $sort : { "_id" : 1 } }
        
      ] 

      let followupResult = await db_connect
        .collection("jobsData")
        .aggregate(pipelineFollowup)
        .toArray();
      
        let nonFollowupResult = await db_connect
        .collection("jobsData")
        .aggregate(pipelineNonFollowup)
        .toArray();

        let applicationFreqResult = await db_connect
        .collection("jobsData")
        .aggregate(pipelineAppFreq)
        .toArray();

        weekBoundaries.pop()
        return NextResponse.json({data:{noFollowup: nonFollowupResult, followup: followupResult, applicationFreq: applicationFreqResult, weeks: weekBoundaries}});

      
    } catch (e) {
        console.error(e)
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"})
    }
    }
