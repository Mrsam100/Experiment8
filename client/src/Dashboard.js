import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Dashboard() {
  const navigate = useNavigate();

 useEffect(() => {
  const token = localStorage.getItem("token");

  if (!token) {
    navigate("/");
    return;
  }

  axios.get("https://auth-project-92rv.onrender.com/dashboard", {
    headers: { Authorization: token }
  })
  .catch(() => {
    navigate("/");
  });

}, [navigate]); // ✅ FIX HERE

  return <h1>User Dashboard</h1>;
}

export default Dashboard;