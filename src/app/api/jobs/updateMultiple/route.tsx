import { NextResponse, NextRequest } from 'next/server';

import clientPromise from "../../../../../lib/mongodb";
export const revalidate = 0;

// not used in app, for use with API client and only for correcting job entries en masse, usually changing wording for application statuses
export async function PUT(request: NextRequest) {
    if (request.method === 'PUT') {

    try {
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"})
      let myquery = { "user_id": user_id,"appStatus":"Applied; Awaiting Phone Screen" };
      let newvalues = {
        $set: {
         "appStatus": "Applied; Awaiting Telescreen/Coding Test"
        },
      };
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
