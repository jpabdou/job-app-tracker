import { NextResponse, NextRequest } from 'next/server';

import clientPromise from "../../../../../lib/mongodb";

export async function POST(request: NextRequest) {
    if (request.method === 'POST') {

    try {
        let body = await request.json() 
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      let myobj = {
       
         "company": body.company,
         "title": body.title,
         "jobLink": body.jobLink,
         "jobDescription": body.jobDescription || "No Description Added",
         "location": body.location,
         "applicationRoute": body.applicationRoute,
         "dateApplied": body.dateApplied,
         "appStatus": body.appStatus || "Not Yet Applied",
         "outreachContact": body.outreachContact || "",
         "emailFollowup": body.emailFollowup || "no",
         user_id: user_id

      };
          let createResult = await db_connect.collection("jobsData").insertOne({...myobj});
          return NextResponse.json({data: createResult});
        } catch (e) {
            console.error(e)
          }    
        } else{
            let message ={message: "Method Not Allowed"}
            return NextResponse.json(message);
          }
        
        }
