import * as mongoDB from "mongodb";
import { NextResponse, NextRequest } from 'next/server';

const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";

export async function PUT(request: NextRequest) {
    if (request.method === 'PUT') {

    try {
        let body = await request.json() 
        const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { hash, searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      let jobId: string = searchParams.get("jobid") || "";
      let myquery = { "user_id": user_id,
        "_id": new ObjectId(jobId) };
      let newvalues = {
        $set: {
         "company": body.company,
         "title": body.title,
         "jobLink": body.jobLink,
         "jobDescription": body.jobDescription || "No Description Added",
         "location": body.location,
         "applicationRoute": body.applicationRoute,
         "dateApplied": body.dateApplied,
         "appStatus": body.appStatus || "Not Yet Applied",
         "outreachContact": body.outreachContact || "",
         "emailFollowup": body.emailFollowup || "no" 
        },
      };
      let updateResult = await db_connect
        .collection("jobsData")
        .updateOne(myquery, newvalues);
          console.log("1 document updated");
         return NextResponse.json({data: updateResult});
    } catch (e) {
        console.error(e)
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"})
    }
    }
