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
      // if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"})

      let myobj = {
       
        "company": body.company ? body.company : "No Company Added",
        "title": body.title ? body.title : "No Title Added",
        "jobLink": body.jobLink ? body.jobLink : "No Link Added" ,
        "jobDescription": body.jobDescription ? body.jobDescription  : "No Description Added",
        "location": body.location ? body.location : "remote",
        "applicationRoute": body.applicationRoute ? body.applicationRoute : "Not Yet Applied",
        "dateApplied": body.dateApplied ? body.dateApplied : new Date().toJSON().slice(0,10),
        "appStatus": body.appStatus ? body.appStatus : "Not Yet Applied",
        "outreachContact": body.outreachContact ? body.outreachContact : "",
        "emailFollowup": body.emailFollowup ? body.emailFollowup : "no",
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
