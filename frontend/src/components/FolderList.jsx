import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const FolderList = () => {
  const { bucketName, folderPath } = useParams();
  const [items, setItems] = useState([]);
  const [schema, setSchema] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchFolderContents();
  }, [folderPath]);

  const fetchFolderContents = async () => {
    try {
      const response = await axios.get("http://localhost:5002/api/s3/list-files", {
        params: { bucketName, prefix: folderPath ? `${folderPath}/` : "" },
      });
      setItems(response.data);
    } catch (err) {
      console.error("Error fetching folder contents:", err);
      setError("Failed to load folder contents");
    }
  };

  const fetchSchema = async (fileName) => {
    setLoading(true);
    setSchema([]);
    setError(null);

    try {
      const response = await axios.post("http://localhost:5002/api/schema/file-schema", {
        bucketName,
        fileName,
      });
      setSchema(response.data.schema);
    } catch (err) {
      console.error("Error fetching file schema:", err);
      setError("Failed to load file schema");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>Contents of {folderPath || "Root"}</h2>
      
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul>
        {/* Display folders */}
        {items.folders?.map((folder) => (
          <li key={folder}>
            <button onClick={() => window.location.href = `/bucket/${bucketName}/${folder}`}>
              📁 {folder}
            </button>
          </li>
        ))}

        {/* Display files */}
        {items.files?.map((file) => (
          <li key={file}>
            <button onClick={() => fetchSchema(file)}>
              📄 {file}
            </button>
          </li>
        ))}
      </ul>

      {/* Show Schema if available */}
      {loading && <p>Loading schema...</p>}
      {schema.length > 0 && (
        <div>
          <h3>Schema (Column Names)</h3>
          <ul>
            {schema.map((column, index) => (
              <li key={index}>{column}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FolderList;
