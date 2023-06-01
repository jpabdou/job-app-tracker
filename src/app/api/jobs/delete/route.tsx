import { Job } from "../../../../../types/Jobs";
import runMiddleware from "../../middleware";
import { NextResponse, NextRequest } from 'next/server';
import * as mongoDB from "mongodb";

const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";

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
          dateApplied: {
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

export async function DELETE(request: NextRequest) {
    if (request.method === 'DELETE') {
    try {
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      let jobId: string  = searchParams.get("jobid") || "";
      let query = { _id: new ObjectId(jobId), user_id: user_id };
      let deleteResult = await db_connect.collection("jobsData").deleteOne(query);
        console.log("1 document deleted");
        return NextResponse.json({data: deleteResult});
    } catch (e) {
        console.error(e)
      }
    } else{
        NextResponse.json({message: "Method Not Allowed"})
    }
    }
