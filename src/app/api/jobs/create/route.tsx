import { NextResponse, NextRequest } from 'next/server';

import clientPromise from "../../../../../lib/mongodb";
// Added to ensure fetch requests are not cached. This was due to an error thrown while deploying to Vercel. 
export const revalidate = 0;

export async function POST(request: NextRequest) {
    if (request.method === 'POST') {

    try {
      // await fulfillment value of Promise for reading of request body and parsing as a json
      let body = await request.json();
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      // finds user's ID to save the job data under through the request url's search params
      let user_id: string  = searchParams.get("id") || "";
      // conditional to ensure no changes to trial user data
      if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"});

      // set jobObj values to body values or to default values if empty with the exception of user_id, which is required for authorizing user access and obtained from user_id variable
      let jobObj = {
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

      // inserts jobObj to database and returns result in response
          let createResult = await db_connect.collection("jobsData").insertOne({...jobObj});
          return NextResponse.json({data: createResult});
        } catch (e) {
            console.error(e);
          }    
        } else{
          // return wrong method response if POST not the request.method
            let message ={message: "Method Not Allowed"};
            return NextResponse.json(message);
          }
        
        }
