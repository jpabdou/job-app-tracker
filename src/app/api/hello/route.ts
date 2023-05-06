const express = require("express");

const server = express();
import { ObjectId } from "mongodb";

const cors = require("cors");

require("dotenv").config({ path: "./config.env" });
const port = process.env.PORT || 5000;

server.use(cors());
server.use(express.json());

server.use(require("./routes/jobs"));

// Get MongoDB driver connection
const dbo = require("../../../../db/conn.js");

server.listen(port, ()=> {
    dbo.connectToServer(function (err) {
        if (err) {
            console.error(err);
        }
    });
    console.log(`Server is running on port: ${port}`);
})
