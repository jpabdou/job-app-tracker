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
        { $match: { emailFollowup: "no",  "user_id": user_id} },
        { $group: { _id: "$appStatus", count: { $sum: 1 } } }
      ]
      const now = new Date();
      const currentDate = now.toJSON().slice(0,10);
      const weekBoundaries : string[] = [currentDate]
      const weeksArr : number[] = [7,14,21,28, 42, 56, 70, 84, 98, 112];
      for (const week of weeksArr) {
        const weekDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - week).toJSON().slice(0,10);
        weekBoundaries.unshift(weekDate)
      }

      const appRatePipeling= [
        {$match: { "user_id": user_id }},
          {$bucket: {
            groupBy: "$dateApplied",                        // Field to group by
            boundaries: weekBoundaries, // Boundaries for the buckets
            default: "Earlier",                             // Bucket ID for documents which do not fall into a bucket
            output: {                                     // Output for each bucket
              "count": { $sum: 1},
            }
          }}
        
      ] 

      let followupResult = await db_connect
        .collection("jobsData")
        .aggregate(pipelineFollowup)
        .toArray();
      
        let nonFollowupResult = await db_connect
        .collection("jobsData")
        .aggregate(pipelineNonFollowup)
        .toArray();

        let applicationRateResult = await db_connect
        .collection("jobsData")
        .aggregate(appRatePipeling)
        .toArray();

        return NextResponse.json({data:{noFollowup: nonFollowupResult, followup: followupResult, applicationRate: applicationRateResult}});

      
    } catch (e) {
        console.error(e)
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"})
    }
    }
