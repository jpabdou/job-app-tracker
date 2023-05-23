import { Job } from "../../../../../types/Jobs";
import runMiddleware from "../../middleware";
import { NextApiResponse, NextApiRequest } from 'next';
import * as mongoDB from "mongodb";

const ObjectId = mongoDB.ObjectId;
import clientPromise from "../../../../../lib/mongodb";
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

export async function DELETE(request: NextApiRequest, response: NextApiResponse) {
    if (request.method === 'DELETE') {
    try {
      const client = await clientPromise;
      let db_connect = client.db("jobsData");
      const { hash, searchParams } = new URL(request.url!);
      let user_id: string  = searchParams.get("id") || "";
      let query = { _id: new ObjectId(hash), user_id: user_id };
      let deleteResult = await db_connect.collection("jobsData").deleteOne(query);
        console.log("1 document deleted");
        return response.status(200).json(deleteResult);
    } catch (e) {
        console.error(e)
      }
    } else{
        response.status(405).json({message: "Method Not Allowed"})
    }
    }
