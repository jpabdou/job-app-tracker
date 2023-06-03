import { NextResponse, NextRequest } from 'next/server';

import clientPromise from "../../../../../lib/mongodb";

export async function PUT(request: NextRequest) {
    if (request.method === 'PUT') {

    try {
        // let body = await request.json() 
        const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      let myquery = { "user_id": user_id,'location':null};
      let newvalues = {
        $set: {
         "location": "Remote"
        },
      };
      let updateResult = await db_connect
        .collection("jobsData")
        .updateMany(myquery, newvalues);
          console.log("Documents updated");
         return NextResponse.json({data: updateResult});
    } catch (e) {
        console.error(e)
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"})
    }
    }
