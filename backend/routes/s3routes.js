const express = require("express");
const AWS = require("aws-sdk");
const router = express.Router();

const s3 = new AWS.S3({
  region: process.env.AWS_REGION,
  accessKeyId: process.env.AWS_ACCESS_KEY,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
});

router.get("/buckets", async (req, res) => {
  try {
    const data = await s3.listBuckets().promise(); 
    res.json(data.Buckets); 
  } catch (err) {
    console.error("Error fetching S3 buckets:", err);
    res.status(500).json({ error: "Failed to fetch S3 buckets" });
  }
});

router.get("/list-files", async (req, res) => {
  const { bucketName, prefix } = req.query;

  if (!bucketName) {
    return res.status(400).json({ error: "Bucket name is required!" });
  }

  const params = {
    Bucket: bucketName,
    Prefix: prefix || "",
    Delimiter: "/",
  };

  try {
    const data = await s3.listObjectsV2(params).promise();

    if (!data) {
      throw new Error("No data received from S3");
    }

    console.log("S3 Response:", JSON.stringify(data, null, 2));

    const filesAndFolders = {
      folders: data.CommonPrefixes ? data.CommonPrefixes.map((item) => item.Prefix) : [],
      files: data.Contents ? data.Contents.map((item) => item.Key).filter((key) => key !== prefix) : [],
    };

    res.json(filesAndFolders);
  } catch (error) {
    console.error("Error fetching S3 files:", error);
    res.status(500).json({ error: error.message || "Failed to fetch files." });
  }
});


  

module.exports = router;
