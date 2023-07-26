import * as mongoDB from "mongodb";
import { NextResponse, NextRequest } from 'next/server';
const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";
export const revalidate = 0;

export async function GET(request: NextRequest) {
    if (request.method === 'GET') {
    try {
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { hash, searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      let jobId: string = searchParams.get("jobid") || "";
      if (jobId.length>0) {     
        let myquery = { "user_id": user_id,
          "_id": new ObjectId(jobId) };
        let jobResult = await db_connect
          .collection("jobsData")
          .findOne(myquery);
       return NextResponse.json({data: {...jobResult, id: jobId}});
          
      } else {
          let myquery = { "user_id": user_id}
          let idx = 0
          let cursor = db_connect
            .collection("jobsData")
            .find(myquery)
            .map((job)=>{
              job.id= job._id.toString();
              job.jobNumber = idx;
              idx++
              return job
            })

            const result = await cursor.toArray();

            return NextResponse.json({data:result});

      }
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: e});
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"});
    }
    }
