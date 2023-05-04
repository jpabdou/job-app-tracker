const express = require("express");
 
// recordRoutes is an instance of the express router.
// We use it to define our routes.
// The router will be added as a middleware and will take control of requests starting with path /record.
const jobRoutes = express.Router();
 
// This will help us connect to the database
const dbo = require("../db/conn");
 
// This helps convert the id from string to ObjectId for the _id.
const ObjectId = require("mongodb").ObjectId;
 
 
// This section will help you get a list of all the jobs.
jobRoutes.route("/jobs").get(function (req, res) {
 let db_connect = dbo.getDb("jobsData");
 db_connect
   .collection("jobsData")
   .find({})
   .toArray(function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});
 
// This section will help you get a single job by id
jobRoutes.route("/jobs/:id").get(function (req, res) {
 let db_connect = dbo.getDb();
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect
   .collection("jobsData")
   .findOne(myquery, function (err, result) {
     if (err) throw err;
     res.json(result);
   });
});


// This section will help you create a new job.
jobRoutes.route("/jobs/add").post(function (req, response) {
 let db_connect = dbo.getDb("jobsData");
 let myobj = {
   company: req.body.company,
   title: req.body.title,
   URL: req.body.url,
   jobDescription: req.body.jobDescription || "",
   location: req.body.location,
   applicationRoute: req.body.applicationRoute,
   currentStatus: req.body.currentStatus || "Applied",
   dateApplied: req.body.dateApplied,
   appStatus: req.body.appStatus || "Applied",
   result: req.body.result || "Applied",
   outreachContact: req.body.outreachContact || "",
 };
 db_connect.collection("jobsData").insertOne(myobj, function (err, res) {
   if (err) throw err;
   response.json(res);
 });
});
 
// This section will help you update a job by id.
jobRoutes.route("/jobs/update/:id").post(function (req, response) {
 let db_connect = dbo.getDb("jobsData");
 let myquery = { _id: ObjectId(req.params.id) };
 let newvalues = {
   $set: {
    company: req.body.company,
    title: req.body.title,
    URL: req.body.url,
    jobDescription: req.body.jobDescription || "",
    location: req.body.location,
    applicationRoute: req.body.applicationRoute,
    currentStatus: req.body.currentStatus || "Applied",
    dateApplied: req.body.dateApplied,
    appStatus: req.body.appStatus || "Applied",
    result: req.body.result || "Applied",
    outreachContact: req.body.outreachContact || "",
   },
 };
 db_connect
   .collection("jobsData")
   .updateOne(myquery, newvalues, function (err, res) {
     if (err) throw err;
     console.log("1 document updated");
     response.json(res);
   });
});
 
// This section will help you delete a job
jobRoutes.route("/jobs/:id").delete((req, response) => {
 let db_connect = dbo.getDb("jobsData");
 let myquery = { _id: ObjectId(req.params.id) };
 db_connect.collection("jobsData").deleteOne(myquery, function (err, obj) {
   if (err) throw err;
   console.log("1 document deleted");
   response.json(obj);
 });
});
 
module.exports = recordRoutes;
