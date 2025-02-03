import React, { useState } from "react";
import axios from "axios";

const QueryResults = ({ fileName, bucketName }) => {
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchSchema = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.post("http://localhost:5002/api/query-file-schema", {
        bucketName,
        fileName,
      });
      setSchema(response.data.schema);
    } catch (err) {
      setError("Failed to fetch schema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <button onClick={fetchSchema} disabled={loading}>
        {loading ? "Loading..." : "Fetch Schema"}
      </button>
      {error && <p>{error}</p>}
      {schema.length > 0 && (
        <ul>
          {schema.map((column, index) => (
            <li key={index}>{column}</li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default QueryResults;
