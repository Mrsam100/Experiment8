import axios from "axios";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

function Admin() {
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

}, [navigate]); // ✅ FIXED

  return <h1>Admin Dashboard</h1>;
}

export default Admin;