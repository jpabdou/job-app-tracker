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
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      let jobId: string = searchParams.get("jobid") || "";
      let myquery = { "user_id": user_id,
        "_id": new ObjectId(jobId) };
      let newvalues = {
        $set: {
         "company": body.company ? body.company : "No Company Added",
         "title": body.title ? body.title : "No Title Added",
         "jobLink": body.jobLink ? body.jobLink : "No Link Added" ,
         "jobDescription": body.jobDescription ? body.jobDescription  : "No Description Added",
         "location": body.location ? body.location : "remote",
         "applicationRoute": body.applicationRoute ? body.applicationRoute : "Not Yet Applied",
         "dateApplied": body.dateApplied ? body.dateApplied : new Date().toJSON().slice(0,10),
         "appStatus": body.appStatus ? body.appStatus : "Not Yet Applied",
         "outreachContact": body.outreachContact ? body.outreachContact : "",
         "emailFollowup": body.emailFollowup ? body.emailFollowup : "no" 
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
