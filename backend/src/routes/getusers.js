"use strict";

const AWS = require("aws-sdk");

module.exports.handle = (event, context, callback) => {
  const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });
  let paramns = {
    TableName: process.env.DYNAMODB_TABLE,
  };

  docClient.scan(paramns, (err, data) => {
    if (err) {
      return callback(err, {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Error to get items.",
          error: err,
        }),
      });
    } else {
      console.log("Item foi lido com sucesso");
      return callback(null, {
        statusCode: 201,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          message: "Success to get the items.",
          data: data.Items,
        }),
      });
    }
  });
};
