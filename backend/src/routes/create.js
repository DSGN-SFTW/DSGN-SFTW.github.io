"use strict";

const AWS = require("aws-sdk");
const User = require("../models/User");

const badrequest = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({
    created: false,
    message: "Bad Request",
  }),
};

module.exports.handle = async (event) => {
  let { body } = event;
  body = JSON.parse(body);
  if (!body) return badrequest;
  let { name, email, password, user_group, active } = body;
  if (!(name && email && password && user_group)) return badrequest;

  const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  let paramns = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email,
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
        created: false,
        message: "Error",
        err,
      }),
    };
  }

  if (data.Item)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        created: false,
        message: "User already exists",
      }),
    };

  password = await User.cryptPassword(password);
  const user = new User(name, email, password, user_group, active);

  paramns = {
    TableName: process.env.DYNAMODB_TABLE,
    Item: user.getAttrs(),
  };

  data = {};
  try {
    data = await docClient.put(paramns).promise();
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        created: false,
        message: "User dont created",
        err,
      }),
    };
  }

  return {
    statusCode: 201,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      created: true,
      message: "User created",
      data,
    }),
  };
};
