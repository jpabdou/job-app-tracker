import { NextResponse, NextRequest } from 'next/server';

import clientPromise from "../../../../../lib/mongodb";
export const revalidate = 0;

// endpoint for updating all applications that were submitted before a given date that haven't been updated since then to "No Response"
export async function PUT(request: NextRequest) {
    if (request.method === 'PUT') {

    try {
      // await fulfillment value of Promise for reading of request body and parsing as a json
      let body = await request.json();
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"});
      // sets all applications still on "Applied; Awaiting Telescreen/Coding Test" before the target week date (given in body.weekDate) to "Applied; No Response"
      let myquery = { "user_id": user_id,"appStatus": "Applied; Awaiting Telescreen/Coding Test", dateApplied: {$lt: body.weekDate}};
      let newvalues = {
        $set: {
         "appStatus": "Applied; No Response"
        },
      };
      // Connects to "jobsData" collection, querys job entry according to query by application status, updates job with newvalues object, and returns result in response
      let updateResult = await db_connect
        .collection("jobsData")
        .updateMany(myquery, newvalues);
          console.log("Documents updated");
         return NextResponse.json({data: updateResult});
    } catch (e) {
        console.error(e);

      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"});
    }
    }
