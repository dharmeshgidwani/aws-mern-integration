const express = require("express");
const router = express.Router();
const AWS = require("aws-sdk");
const stream = require("stream");
const csvParser = require("csv-parser");

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

// 🟢 Fetch schema from CSV file in S3
router.post("/file-schema", async (req, res) => {
  const { bucketName, fileName } = req.body;

  if (!bucketName || !fileName) {
    return res.status(400).json({ error: "Bucket name and file name are required!" });
  }

  const params = { Bucket: bucketName, Key: fileName };

  try {
    const s3Stream = s3.getObject(params).createReadStream();

    let headers = [];
    s3Stream
      .pipe(csvParser())
      .on("headers", (headerList) => {
        headers = headerList;
      })
      .on("end", () => {
        res.json({ schema: headers });
      })
      .on("error", (error) => {
        console.error("Error reading file:", error);
        res.status(500).json({ error: "Failed to read file schema" });
      });

  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
