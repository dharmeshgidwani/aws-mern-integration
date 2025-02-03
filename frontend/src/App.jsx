import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import BucketList from "./components/BucketList";
import FolderList from "./components/FolderList";
import FileViewer from "./components/FileViewer";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<BucketList />} />
        <Route path="/bucket/:bucketName" element={<FolderList />} />
        <Route path="/bucket/:bucketName/file/:fileName" element={<FileViewer />} />
      </Routes>
    </Router>
  );
};

export default App;
