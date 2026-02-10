import React from "react";
import { Routes, Route } from "react-router-dom";

// Import all your pages
import Welcome from "./pages/Welcome";
import TeacherLogin from "./pages/TeacherLogin";
import Login from "./pages/Login";
import StudentDashboard from "./pages/StudentDashboard";
import TeacherDashboard from "./pages/TeacherDashboard";
import MarkAttendance from "./pages/MarkAttendance";
import MyStars from "./pages/MyStars";
import StudentProgressDashboard from "./pages/StudentProgressDashboard";

function App() {
  return (
    <Routes>
      {/* Public Pages */}
      <Route path="/" element={<Welcome />} />
      <Route path="/teacher-login" element={<TeacherLogin />} />
      <Route path="/login" element={<Login />} />

      {/* Student Routes */}
      <Route path="/student-dashboard" element={<StudentDashboard />} />
      <Route path="/my-stars" element={<MyStars />} />
      <Route path="/progress" element={<StudentProgressDashboard />} />

      {/* Teacher Routes */}
      <Route path="/teacher-dashboard" element={<TeacherDashboard />} />
      <Route path="/take-attendance" element={<MarkAttendance />} />
    </Routes>
  );
}

export default App;
