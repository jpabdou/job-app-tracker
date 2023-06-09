import { Job } from "../../../../../types/Jobs";
import { NextResponse, NextRequest } from 'next/server';

import clientPromise from "../../../../../lib/mongodb";

// not used in app

export async function POST(request: NextRequest) {
    if (request.method === 'POST') {

    try {
        let body = await request.json() 
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"})
      let jobs : Job[] = body.jobs;
      console.log(jobs.length)
          let createResult = await db_connect.collection("jobsData").insertMany(jobs);
          return NextResponse.json({data: createResult});
        } catch (e) {
            console.error(e)
          }    
        } else{
            let message ={message: "Method Not Allowed"}
            return NextResponse.json(message);
          }
        
        }
