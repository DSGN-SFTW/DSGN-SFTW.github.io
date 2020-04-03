const express = require("express");
const DB_Connect = require('./src/controllers/DB_Connection');
const requireDir = require("require-dir");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//Start Database
DB_Connect();
requireDir("./src/models/");

app.use("/", require("./src/routes"));

app.listen(3000);
