require('dotenv').config();
const mongoose = require("mongoose");
const DB_Config = require("../config/DB_Env");

async function DatabaseConnect() {
  try{
    await mongoose.connect(DB_Config.DB_CONNECTION_URL ||process.env.DB_CONNECTION_URL, DB_Config.dbConfigOptions);
  }catch(err){
    console.log('Error: ', err);
  }
}

module.exports = DatabaseConnect;
