import { Job } from "../../../types/Jobs";

import runMiddleware from "./middleware";
import * as dotenv from "dotenv";
import { NextApiResponse, NextApiRequest } from 'next';

const port = process.env.PORT || 3000;

import * as mongoDB from "mongodb";

const ObjectId = mongoDB.ObjectId;

import clientPromise from "../../../lib/mongodb";

const collections: { jobs?: mongoDB.Collection<Job> } = {};

async function applySchemaValidation(db: mongoDB.Db) {
  let collectionName : string = process.env.COLLECTION_NAME as string;

  const jsonSchema = {
      $jsonSchema: {
          bsonType: "object",
          required: ["company", "title", "jobLink", "location", "applicationRoute", "Date"],
          additionalProperties: false,
          properties: {
              _id: {},
              company: {
                  bsonType: "string",
                  description: "company is required and is a string",
              },
              title: {
                  bsonType: "string",
                  description: "title is required and is a string",
              },
              jobLink: {
                  bsonType: "string",
                  description: "Job Link is required and is a string",
              },
              location: {
                bsonType: "string",
                description: "location is required and is a string",
            },
            applicationRoute: {
              bsonType: "string",
              description: "applicationRoute is required and is a string",
          },            
          Date: {
            bsonType: "string",
            description: "Date is required and is a string",
        }, user_id:  {
          bsonType: "string",
          description: "User ID is required and is a string",
        }
          },
      },
  };

  // Try applying the modification to the collection, if the collection doesn't exist, create it 
 await db.command({
      collMod: collectionName,
      validator: jsonSchema
  }).catch(async (error: mongoDB.MongoServerError) => {
      if (error.codeName === 'NamespaceNotFound') {
          await db.createCollection(collectionName, {validator: jsonSchema});
      }
  });
}

// export async function handler(request: NextApiRequest, response: NextApiResponse) {
//   try {
//     request.body  = JSON.parse(request.body)
//     const client = await clientPromise;
//     let db_connect = client.db("jobsData");
//     const { hash, searchParams } = new URL(request.url!);
//     let user_id: string  = searchParams.get("id") || "";
//     switch (request.method) {
//       case 'POST':
//         let myobj = {
//           company: request.body.company,
//           title: request.body.title,
//           URL: request.body.url,
//           jobDescription: request.body.jobDescription || "No Description Added",
//           location: request.body.location,
//           applicationRoute: request.body.applicationRoute,
//           dateApplied: request.body.dateApplied,
//           appStatus: request.body.appStatus || "Not Yet Applied",
//           emailFollowup: request.body.emailFollowup || "no",
//           outreachContact: request.body.outreachContact || "",
//         };
//         let createResult = await db_connect.collection("jobsData").insertOne(myobj)
//           response.status(200).json({data: {...createResult}});
//         break;
//       case 'GET':
  
//         if (hash.length>0) {
//           let myquery = { user_id: user_id,
//             _id: new ObjectId(hash) };
//           let jobResult = await db_connect
//             .collection("jobsData")
//             .findOne(myquery)
//           response.status(200).json({data: {...jobResult, id: hash}});
            
//         } else {
//             let myquery = { user_id: user_id}
//             let result = await db_connect
//               .collection("jobsData")
//               .find(myquery)
//               .toArray();
//             response.status(200).json({data: result});

//         }
//         break;
//       case "PUT":
        
//         let myquery = { user_id: user_id,
//           _id: new ObjectId(hash) };
//         let newvalues = {
//           $set: {
//            company: request.body.company,
//            title: request.body.title,
//            URL: request.body.url,
//            jobDescription: request.body.jobDescription || "No Description Added",
//            location: request.body.location,
//            applicationRoute: request.body.applicationRoute,
//            dateApplied: request.body.dateApplied,
//            appStatus: request.body.appStatus || "Not Yet Applied",
//            outreachContact: request.body.outreachContact || "",
//            emailFollowup: request.body.emailFollowup || "no" 
//           },
//         };
//         let updateResult = await db_connect
//           .collection("jobsData")
//           .updateOne(myquery, newvalues)
//             console.log("1 document updated");
//             response.status(200).json({data: {...updateResult, id: hash}});
          
//         break;
//       case "DELETE":
//         let query = { _id: new ObjectId(hash) };
//         let deleteResult = await db_connect.collection("jobsData").deleteOne(query)
//           console.log("1 document deleted");
//           response.status(200).json({data: {...deleteResult, id: hash}});
        
//         break;  }

//   } catch (e) {
//     console.error(e)
//   }

// }
