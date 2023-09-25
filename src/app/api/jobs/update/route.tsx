import * as mongoDB from "mongodb";
import { NextResponse, NextRequest } from 'next/server';

const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";
export const revalidate = 0;

export async function PUT(request: NextRequest) {
    if (request.method === 'PUT') {

    try {
      // await fulfillment value of Promise for reading of request body and parsing as a json
      let body = await request.json(); 
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      // finds user's ID and job ID to read the job data through the request url's search params
      let user_id: string  = searchParams.get("id") || "";
      let jobId: string = searchParams.get("jobid") || "";
      if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"})
      let myquery = { "user_id": user_id,
        "_id": new ObjectId(jobId) };
      // set newvalues values to body values or to default values if empty
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

      // Connects to "jobsData" collection, querys job entry according to query by job ID, updates job with newvalues object, and returns result in response
      let updateResult = await db_connect
        .collection("jobsData")
        .updateOne(myquery, newvalues);
          console.log("1 document updated");
         return NextResponse.json({data: updateResult});
    } catch (e) {
        console.error(e);

      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"});
    }
    }
