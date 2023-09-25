import * as mongoDB from "mongodb";
import { NextResponse, NextRequest } from 'next/server';
const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";
// Added to ensure fetch requests are not cached. This was due to an error thrown while deploying to Vercel. 
export const revalidate = 0;

export async function GET(request: NextRequest) {
    if (request.method === 'GET') {
    try {
      // initializes MongoClient connection to URI and opens connection with "jobsData" database
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      // finds user's ID and job ID (optional) to read the job data through the request url's search params
      let user_id: string  = searchParams.get("id") || "";
      let jobId: string = searchParams.get("jobid") || "";
      // conditional that checks if job ID was including in /app/api/jobs/read request
      if (jobId.length>0) {
        // in the case of job ID found, include job ID in query along with user ID
        let myquery = { "user_id": user_id,
          "_id": new ObjectId(jobId) };
        // Connects to "jobsData" collection, reads job entry according to query by job ID, and returns result in response
        let jobResult = await db_connect
          .collection("jobsData")
          .findOne(myquery);
       return NextResponse.json({data: {...jobResult, id: jobId}});
          
      } else {
        // in the case of no job ID found, only search for user ID
          let myquery = { "user_id": user_id};
          // index variable which is used when mapping the MongoDB data results. This is because mongoDB.db.map() is NOT the same as Array.prototype.map() in JavaScript. 
          // One major difference is that there is no indexing built-in for in mongoDB.db.map() so this requires creating an index variable and increasing the variable with each loop in .map()
          let idx = 0;
        // Connects to "jobsData" collection, reads all jobs for a given user ID, and modifies the jobs data object array        
          let cursor = db_connect
            .collection("jobsData")
            .find(myquery)
            .map((job)=>{
              // maps array of job data objects by saving a new "id" key and assigns value which a string-conversion of the unique Mongo ObjectId that each job "_id" is saved under
              // this is to save on time for converting ObjectIds to strings on the client-side and are used as the unique keys for array-mapped React components
              job.id= job._id.toString();
              // saves a "jobNumber" key as the index within the jobs data array. This is to allow for modification of jobs on the client-side without requiring another GET request to show updates.
              job.jobNumber = idx;
              idx++
              return job
            })

            const result = await cursor.toArray();

            return NextResponse.json({data:result});

      }
    } catch (e) {
        console.error(e);
        return NextResponse.json({message: e});
      }
    } else{
        return NextResponse.json({message: "Method Not Allowed"});
    }
    }
