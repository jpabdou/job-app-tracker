import express, {Request, Response} from "express";
import { Job } from "@/components/ManualJobForm";
const server = express();

const cors = require("cors");
import * as dotenv from "dotenv";

const port = process.env.PORT || 5000;

server.use(cors());
server.use(express.json());

const jobRouter = express.Router();

import * as mongoDB from "mongodb";

const ObjectId = mongoDB.ObjectId;

const dbo = require("../../../../db/conn.js");

const collections: { jobs?: mongoDB.Collection<Job> } = {};

async function connectToDatabase() {
  // Pulls in the .env file so it can be accessed from process.env. No path as .env is in root, the default location
  dotenv.config({path: "./config.env"});

  let uri : string = process.env.ATLAS_URI as string;
  let dbName : string = process.env.DB_NAME as string;
  let collectionName : string = process.env.COLLECTION_NAME as string;

  // Create a new MongoDB client with the connection string from .env
  const client = new mongoDB.MongoClient(uri);

  // Connect to the cluster
  await client.connect();

  // Connect to the database with the name specified in .env
  const db = client.db(dbName);
  
  // Apply schema validation to the collection
  await applySchemaValidation(db);

  // Connect to the collection with the specific name from .env, found in the database previously specified
  const jobsCollection = db.collection<Job>(collectionName);

  // Persist the connection to the Games collection
  collections.jobs = jobsCollection;

  console.log(
      `Successfully connected to database: ${db.databaseName} and collection: ${jobsCollection.collectionName}`,
  );
}

async function applySchemaValidation(db: mongoDB.Db) {
  let collectionName : string = process.env.COLLECTION_NAME as string;

  const jsonSchema = {
      $jsonSchema: {
          bsonType: "object",
          required: ["company", "title", "URL", "location", "applicationRoute", "Date"],
          additionalProperties: false,
          properties: {
              _id: {},
              company: {
                  bsonType: "string",
                  description: "'company' is required and is a string",
              },
              title: {
                  bsonType: "string",
                  description: "'title' is required and is a string",
              },
              URL: {
                  bsonType: "string",
                  description: "'URL' is required and is a string",
              },
              location: {
                bsonType: "string",
                description: "'location' is required and is a string",
            },
            applicationRoute: {
              bsonType: "string",
              description: "'applicationRoute' is required and is a string",
          },            
          Date: {
            bsonType: "string",
            description: "'Date' is required and is a string",
        },
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


// This section will help you get a list of all the jobs.
jobRouter.route("/jobs").get(function (req: Request, res: Response) {
 let db_connect = dbo.getDb("jobsData");
 db_connect
   .collection("jobsData")
   .find({})
   .toArray(function (err: mongoDB.MongoServerError, result: Job[]) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you get a single job by id
jobRouter.route("/jobs/:id").get(function (req: Request, res: Response) {
 let db_connect = dbo.getDb();
 let myquery = { _id: new ObjectId(req.params.id) };
 db_connect
   .collection("jobsData")
   .findOne(myquery, function (err: mongoDB.MongoServerError, result: Job) {
     if (err) throw err;
     res.json(result);
   });
});


// This section will help you create a new job.
jobRouter.route("/jobs/add").post(function (req: Request, response: Response) {
 let db_connect = dbo.getDb("jobsData");
 let myobj = {
   company: req.body.company,
   title: req.body.title,
   URL: req.body.url,
   jobDescription: req.body.jobDescription || "No Description Added",
   location: req.body.location,
   applicationRoute: req.body.applicationRoute,
   dateApplied: req.body.dateApplied,
   appStatus: req.body.appStatus || "Not Yet Applied",
   emailFollowup: req.body.emailFollowup || "no",
   outreachContact: req.body.outreachContact || "",
 };
 db_connect.collection("jobsData").insertOne(myobj, function (err:mongoDB.MongoServerError, res: Job) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a job by id.
jobRouter.route("/jobs/update/:id").post(function (req: Request, response: Response) {
 let db_connect = dbo.getDb("jobsData");
 let myquery = { _id: new ObjectId(req.params.id) };
 let newvalues = {
   $set: {
    company: req.body.company,
    title: req.body.title,
    URL: req.body.url,
    jobDescription: req.body.jobDescription || "",
    location: req.body.location,
    applicationRoute: req.body.applicationRoute,
    dateApplied: req.body.dateApplied,
    appStatus: req.body.appStatus || "Applied",
    outreachContact: req.body.outreachContact || "",
    emailFollowup: req.body.emailFollowup || "no" 
   },
 };
 db_connect
   .collection("jobsData")
   .updateOne(myquery, newvalues, function (err:mongoDB.MongoServerError, res: Job) {
     if (err) throw err;
     console.log("1 document updated");
     response.json(res);
   });
});
 
// This section will help you delete a job
jobRouter.route("/jobs/:id").delete((req: Request, response: Response) => {
 let db_connect = dbo.getDb("jobsData");
 let myquery = { _id: new ObjectId(req.params.id) };
 db_connect.collection("jobsData").deleteOne(myquery, function (err: mongoDB.MongoServerError, obj:Job) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});









connectToDatabase()
  .then(()=>{
    server.use("/job-list", jobRouter);
    server.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  })
  .catch((error: Error) => {
    console.error("Database connection failed", error);
    process.exit();
});
