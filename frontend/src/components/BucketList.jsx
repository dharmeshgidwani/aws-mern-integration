import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BucketList = () => {
  const [buckets, setBuckets] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get("http://localhost:5002/api/s3/buckets")
      .then(res => setBuckets(res.data))
      .catch(err => console.error(err));
  }, []);

  return (
    <div>
      <h2>S3 Buckets</h2>
      <ul>
        {buckets.map(bucket => (
          <li key={bucket.Name}>
            <button onClick={() => navigate(`/bucket/${bucket.Name}`)}>
              {bucket.Name}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BucketList;
