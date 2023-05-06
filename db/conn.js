const { MongoClient } = require("mongodb");
const Db = process.env.ATLAS_URI;
const client = new MongoClient(connectionString);

let conn;
try {
  conn = await client.connect();
} catch(e) {
  console.error(e);
}

let db = conn.db("jobsData");

export default db;
// const client = new MongoClient(Db, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });
 
// var _db;
 
// module.exports = {
//   connectToServer: function (callback) {
//     client.connect(function (err, db) {
//       // Verify we got a good "db" object
//       if (err) { return callback(err); }
//       if (db)
//       {
//         _db = db.db("jobsData");
//         console.log("Successfully connected to MongoDB."); 
//       }
//       return callback(null);
//          });
//   },
 
//   getDb: function () {
//     return _db;
//   },
// };
