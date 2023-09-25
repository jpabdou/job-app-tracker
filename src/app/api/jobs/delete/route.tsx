import { NextResponse, NextRequest } from 'next/server';
import * as mongoDB from "mongodb";

const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";
// Added to ensure fetch requests are not cached. This was due to an error thrown while deploying to Vercel. 
export const revalidate = 0;

export async function DELETE(request: NextRequest) {
    if (request.method === 'DELETE') {
    try {
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      // finds user's ID to save the job data under through the request url's search params
      let user_id: string  = searchParams.get("id") || "";
      // conditional to ensure no changes to trial user data
      if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"});
      // finds job ID to search for the job to be deleted through the request url's search params
      let jobId: string  = searchParams.get("jobid") || "";
      // creates query object for jobId and user_id
      let query = { _id: new ObjectId(jobId), user_id: user_id };
      // Connects to "jobsData" collection, deletes job according to query, and returns result in response
      let deleteResult = await db_connect.collection("jobsData").deleteOne(query);
        console.log("1 document deleted");
        return NextResponse.json({data: deleteResult});
    } catch (e) {
        console.error(e)
      }
    } else{
        NextResponse.json({message: "Method Not Allowed"})
    }
    }
