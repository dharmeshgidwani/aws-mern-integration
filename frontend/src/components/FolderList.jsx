import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";

const FolderList = ({ onFileClick }) => {
  const { bucketName } = useParams();
  const [folders, setFolders] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    axios.get(`http://localhost:5002/api/s3/list-files?bucketName=${bucketName}`)
      .then(res => {
        setFolders(res.data.folders);
        setFiles(res.data.files);
        setLoading(false);
      })
      .catch(err => console.error("Error fetching S3 objects:", err));
  }, [bucketName]);

  return (
    <div>
      <h2>Contents of {bucketName}</h2>
      {loading ? <p>Loading...</p> : (
        <>
          <h3>📁 Folders</h3>
          <ul>
            {folders.length > 0 ? folders.map(folder => (
              <li key={folder}><button>{folder}</button></li>
            )) : <li>No folders found</li>}
          </ul>

          <h3>📄 Files</h3>
          <ul>
            {files.length > 0 ? files.map(file => (
              <li key={file}>
                <button onClick={() => onFileClick(file)}>{file}</button>
              </li>
            )) : <li>No files found</li>}
          </ul>
        </>
      )}
    </div>
  );
};

export default FolderList;
