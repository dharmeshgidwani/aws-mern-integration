const AWS = require("aws-sdk");
require("dotenv").config();  

AWS.config.update({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

const s3 = new AWS.S3();
const athena = new AWS.Athena();

module.exports = { s3, athena };
