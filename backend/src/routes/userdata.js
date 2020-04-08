"use strict";

const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");

module.exports.handle = async (event) => {
  let auth_token = event.headers["x-auth-token"];

  if (!auth_token)
    return {
      statusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        auth: false,
        message: "No token provided",
      }),
    };

  let decoded = "";
  try {
    decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        auth: false,
        err,
      }),
    };
  }

  const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  const paramns = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email: decoded.email,
    },
  };

  let data = {};
  try {
    data = await docClient.get(paramns).promise();
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        auth: false,
        message: "Error",
        err,
      }),
    };
  }

  delete data.Item["password"];

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      auth: true,
      data: data.Item,
    }),
  };
};
