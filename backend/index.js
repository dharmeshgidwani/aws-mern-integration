const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
app.use(cors());
app.use(express.json());

const s3Routes = require("./routes/s3Routes");
const athenaRoutes = require("./routes/schemaRoutes");

app.use("/api/s3", s3Routes);
app.use("/api/athena", athenaRoutes);

const PORT = process.env.PORT || 5002;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
