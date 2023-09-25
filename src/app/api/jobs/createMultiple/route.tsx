import { Job } from "../../../../../types/Jobs";
import { NextResponse, NextRequest } from 'next/server';
import clientPromise from "../../../../../lib/mongodb";
// Added to ensure fetch requests are not cached. This was due to an error thrown while deploying to Vercel. 
export const revalidate = 0;
// not used in app; for use with API client
export async function POST(request: NextRequest) {
    if (request.method === 'POST') {

    try {
      // await fulfillment value of Promise for reading of request body and parsing as a json
      let body = await request.json();
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      if (user_id === "6482c564b18df6bd4874cb5c") return NextResponse.json({message: "Cannot use the trial user_id"});
      let jobs : Partial<Job>[] = body.jobs;
      
      // loop to fix empty fields in job entries
      for (let i=0; i< jobs.length; i++) {
        jobs[i] = {
          "company": jobs[i].company ? jobs[i].company : "No Company Added",
          "title": jobs[i].title ? jobs[i].title : "No Title Added",
          "jobLink": jobs[i].jobLink ? jobs[i].jobLink : "No Link Added" ,
          "jobDescription": jobs[i].jobDescription ? jobs[i].jobDescription  : "No Description Added",
          "location": jobs[i].location ? jobs[i].location : "remote",
          "applicationRoute": jobs[i].applicationRoute ? jobs[i].applicationRoute : "Not Yet Applied",
          "dateApplied": jobs[i].dateApplied ? jobs[i].dateApplied : new Date().toJSON().slice(0,10),
          "appStatus": jobs[i].appStatus ? jobs[i].appStatus : "Not Yet Applied",
          "outreachContact": jobs[i].outreachContact ? jobs[i].outreachContact : "",
          "emailFollowup": jobs[i].emailFollowup ? jobs[i].emailFollowup : "no",
           user_id: user_id
         }
      }
      console.log(jobs.length)
          let createResult = await db_connect.collection("jobsData").insertMany(jobs);
          return NextResponse.json({data: createResult});
        } catch (e) {
            console.error(e);
          }    
        } else{
            let message ={message: "Method Not Allowed"};
            return NextResponse.json(message);
          }
        
        }
