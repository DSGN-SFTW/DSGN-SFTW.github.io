"use strict";

const AWS = require("aws-sdk");
const User = require("../models/User");
const jwt = require("jsonwebtoken");

const badrequest = {
  statusCode: 400,
  headers: {
    "Access-Control-Allow-Origin": "*",
  },
  body: JSON.stringify({
    updated: false,
    message: "Bad Request",
  }),
};

module.exports.handle = async (event) => {
  let { body } = event;
  body = JSON.parse(body);
  if (!body) return badrequest;
  let auth_token = event.headers["x-auth-token"];

  if (!auth_token)
    return {
      StatusCode: 401,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        updated: false,
        message: "No token provided",
      }),
    };

  let decoded;
  try {
    decoded = jwt.verify(auth_token, process.env.JWT_SECRET);
  } catch (err) {
    console.log(decoded);
    console.log(err);
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

  // Conecta ao DynamoDB
  const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  // console.log('Decoded', decoded);
  if (!decoded.webToken) {
    const { old_password } = body;

    if (!old_password) return badrequest;
    let data = {};
    const paramns = {
      TableName: process.env.DYNAMODB_TABLE,
      Key: {
        email: decoded.email,
      },
    };

    try {
      data = await docClient.get(paramns).promise();
    } catch (err) {
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

    const { name, user_group } = data.Item;
    const email_ = data.Item.email;
    const password_ = data.Item.password;
    const user = new User(name, email_, password_, user_group);

    const validPassword = await user.verifyPassword(old_password);

    if (!validPassword)
      return {
        statusCode: 400,
        headers: {
          "Access-Control-Allow-Origin": "*",
        },
        body: JSON.stringify({
          updated: false,
          message: "Old password is invalid",
        }),
      };
  }

  const { password } = body;
  const hashPass = await User.cryptPassword(password);
  let updateParamns = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email: decoded.email,
    },
    UpdateExpression: "set password = :password",
    ExpressionAttributeValues: {
      ":password": hashPass,
    },
    ReturnValues: "UPDATED_NEW",
  };

  try {
    await docClient.update(updateParamns).promise();
  } catch (err) {
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
      message: "Password Updated",
      updated: true,
    }),
  };
};
