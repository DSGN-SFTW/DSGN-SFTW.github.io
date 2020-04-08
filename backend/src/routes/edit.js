"use strict";

const AWS = require("aws-sdk");

const badrequest = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({
    auth: false,
    message: "Bad Request",
  }),
};

const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

module.exports.handle = async (event) => {
  let { body } = event;
  body = JSON.parse(body);
  if (!body) return badrequest;
  let { email, name, user_group, active, password } = body;
  if (!email) return badrequest;

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email: email,
    },
    UpdateExpression:
      "set #name  = :name, #password = :pass , user_group = :usergroup ,active = :actv",
    ExpressionAttributeValues: {
      ":name": name,
      ":pass": password,
      ":usergroup": user_group,
      ":actv": active,
    },
    ExpressionAttributeNames: {
      "#name": "name",
      "#password": "password",
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    data = await docClient.update(params).promise();
  } catch (err) {
    console.log("ERRO", err);
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Error",
        updated: false,
        err,
      }),
    };
  }

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      message: "Items has updated",
      updated: true,
    }),
  };
};
