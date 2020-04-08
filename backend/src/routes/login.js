"use strict";

const AWS = require("aws-sdk");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

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

module.exports.handle = async (event) => {
  let { body } = event;
  body = JSON.parse(body);
  if (!body) return badrequest;
  let { email, password } = body;
  if (!(email && password)) return badrequest;

  const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  const paramns = {
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
        auth: false,
        message: "Error",
        err,
      }),
    };
  }

  if (!data.Item)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        auth: false,
        message: "User dont found",
      }),
    };

  const { name, user_group } = data.Item;
  const email_ = data.Item.email;
  const password_ = data.Item.password;
  const user = new User(name, email_, password_, user_group);

  const validPassword = await user.verifyPassword(password);

  if (!validPassword)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        auth: false,
        message: "Invalid password",
      }),
    };

  const token = jwt.sign(
    { email: email_, id: data.Item.id },
    process.env.JWT_SECRET,
    {
      expiresIn: process.env.JWT_TIMEOUT_MOBILE,
    }
  );

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      auth: true,
      message: "Login successful",
      token,
    }),
  };
};
