import { NextResponse, NextRequest } from 'next/server';
import * as mongoDB from "mongodb";

const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";


export async function DELETE(request: NextRequest) {
    if (request.method === 'DELETE') {
    try {
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"})
      let jobId: string  = searchParams.get("jobid") || "";
      let query = { _id: new ObjectId(jobId), user_id: user_id };
      let deleteResult = await db_connect.collection("jobsData").deleteOne(query);
        console.log("1 document deleted");
        return NextResponse.json({data: deleteResult});
    } catch (e) {
        console.error(e)
        return NextResponse.json({ message: e, success: false });
      }
    } else{
        NextResponse.json({message: "Method Not Allowed"})
    }
    }
