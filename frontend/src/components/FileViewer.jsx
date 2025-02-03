import React, { useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FileViewer = () => {
  const { bucketName, fileName } = useParams();
  const [tables, setTables] = useState([]);
  const [columns, setColumns] = useState([]);
  const [loading, setLoading] = useState(false);

  const fetchTables = () => {
    setLoading(true);
    axios.post("http://localhost:5002/api/athena/tables", { database: bucketName })
      .then(res => {
        setTables(res.data.tables);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching tables:", err));
  };

  const fetchSchema = (table) => {
    setLoading(true);
    axios.post("http://localhost:5002/api/athena/table-schema", { database: bucketName, table })
      .then(res => {
        setColumns(res.data.columns);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching schema:", err));
  };

  return (
    <div>
      <h2>File: {fileName}</h2>
      <button onClick={fetchTables}>Get Tables</button>

      {loading && <p>Loading...</p>}

      {tables.length > 0 && (
        <div>
          <h3>Tables:</h3>
          <ul>
            {tables.map(table => (
              <li key={table}>
                <button onClick={() => fetchSchema(table)}>{table}</button>
              </li>
            ))}
          </ul>
        </div>
      )}

      {columns.length > 0 && (
        <div>
          <h3>Schema:</h3>
          <ul>
            {columns.map(column => <li key={column}>{column}</li>)}
          </ul>
        </div>
      )}
    </div>
  );
};

export default FileViewer;
