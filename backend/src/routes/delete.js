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
  let { email } = body;
  if (!email) return badrequest;
  let data = {};

  let params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email: email,
    },
  };

  try {
    data = await docClient.get(params).promise();
    if (data.Item.active) {
      params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          email: email,
        },
        UpdateExpression: "set active  = :active",
        ExpressionAttributeValues: {
          ":active": false,
        },
        ReturnValues: "UPDATED_NEW",
      };
    } else {
      params = {
        TableName: process.env.DYNAMODB_TABLE,
        Key: {
          email: email,
        },
        UpdateExpression: "set active  = :active",
        ExpressionAttributeValues: {
          ":active": true,
        },
        ReturnValues: "UPDATED_NEW",
      };
    }

    data = await docClient.update(params).promise();
    return {
      statusCode: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: `Item has been ${
          data.Attributes.active ? "enabled" : "disabled"
        }!`,
        active: data.Attributes.active,
      }),
    };
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        message: "Nao foi possivel verificar o item",
        err,
      }),
    };
  }
};
