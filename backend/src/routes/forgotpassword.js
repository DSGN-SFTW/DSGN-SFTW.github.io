"use strict";

const jwt = require("jsonwebtoken");
const AWS = require("aws-sdk");
const nodemailer = require("nodemailer");
const Email = require("../models/Email");

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
  const { email } = body;
  if (!email) return badrequest;

  const docClient = new AWS.DynamoDB.DocumentClient({ region: "us-east-1" });

  const params = {
    TableName: process.env.DYNAMODB_TABLE,
    Key: {
      email,
    },
  };

  console.log("Verificando se existe o email na tabela");

  let data = {};
  try {
    data = await docClient.get(params).promise();
    console.log("Return from DynamoDB", data);
  } catch (err) {
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        success: false,
        message: "Email don't send",
        err,
      }),
    };
  }

  if (Object.keys(data).length === 0)
    return {
      statusCode: 400,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
      body: JSON.stringify({
        created: false,
        message: "Email not found",
      }),
    };

  const token = jwt.sign({ email, webToken: true }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_TIMEOUT_WEB,
  });

  let link = process.env.LINK_RESET.concat(token);
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER, // generated ethereal user
      pass: process.env.MAIL_PASSWORD, // generated ethereal password
    },
  });

  const info = await transporter.sendMail({
    from: process.env.MAIL_ADRESS, // sender address
    to: email, // list of receivers
    subject: "Solicitação de Redefinicao de Senha ", // Subject line
    html: Email.generateHtml(
      process.env.LINK_RESET.concat(token),
      data.Item.name
    ), // html body
  });

  console.log("Return from email", info);
  link = `${process.env.LINK_RESET.concat(token)}`;

  return {
    statusCode: 200,
    headers: {
      "Access-Control-Allow-Origin": "*",
    },
    body: JSON.stringify({
      success: true,
      message: "Email in transporting!",
      link: link,
      info,
    }),
  };
};
