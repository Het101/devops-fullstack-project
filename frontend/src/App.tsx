import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/auth/Login";
import PostList from "./pages/posts/PostList";
// import other pages/components as needed

const App = () => (
  <Router>
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/posts" element={<PostList />} />
      {/* Add routes for Register, Dashboard, Post Detail, Post Create/Edit */}
    </Routes>
  </Router>
);

export default App;
