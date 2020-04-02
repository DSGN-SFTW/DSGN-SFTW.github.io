const express = require("express");
const mongoose = require("mongoose");
const requireDir = require("require-dir");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

//Start Database
mongoose.connect("mongodb://localhost:27017/4code", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});
requireDir("./src/models/");

app.use("/", require("./src/routes"));

app.listen(3000);
