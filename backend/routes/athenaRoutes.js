const express = require("express");
const router = express.Router();
const { athena } = require("../config/awsConfig");

// Function to execute Athena query and fetch results
const executeAthenaQuery = async (queryString) => {
  const params = {
    QueryString: queryString,
    ResultConfiguration: { OutputLocation: "s3://my-athena-query-result-dharmesh/" },
  };

  const { QueryExecutionId } = await athena.startQueryExecution(params).promise();
  console.log(`Query Execution ID: ${QueryExecutionId}`);

  // Wait for the query to complete
  let queryStatus;
  do {
    const statusResponse = await athena.getQueryExecution({ QueryExecutionId }).promise();
    queryStatus = statusResponse.QueryExecution.Status.State;

    if (queryStatus === "SUCCEEDED") {
      const result = await athena.getQueryResults({ QueryExecutionId }).promise();
      return result.ResultSet.Rows.map(row => row.Data.map(cell => cell.VarCharValue));
    } else if (queryStatus === "FAILED" || queryStatus === "CANCELLED") {
      throw new Error(`Athena query failed with status: ${queryStatus}`);
    }
  } while (queryStatus === "RUNNING" || queryStatus === "QUEUED");
};

// Route 1: Get list of tables in a database
router.post("/tables", async (req, res) => {
  const { database } = req.body;
  
  if (!database) {
    return res.status(400).json({ error: "Database name is required!" });
  }

  try {
    const queryString = `SHOW TABLES IN ${database}`;
    const tables = await executeAthenaQuery(queryString);
    
    // Remove header row if present
    res.json({ tables: tables.slice(1).flat() });
  } catch (error) {
    console.error("Error fetching tables:", error);
    res.status(500).json({ error: error.message });
  }
});

// Route 2: Get table schema (column names)
router.post("/table-schema", async (req, res) => {
  const { database, table } = req.body;

  if (!database || !table) {
    return res.status(400).json({ error: "Database and table name are required!" });
  }

  try {
    const queryString = `DESCRIBE ${database}.${table}`;
    const schema = await executeAthenaQuery(queryString);
    
    // Extract column names
    const columnNames = schema.slice(1).map(row => row[0]); 
    res.json({ columns: columnNames });
  } catch (error) {
    console.error("Error fetching schema:", error);
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
