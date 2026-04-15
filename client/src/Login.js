import { useForm } from "react-hook-form";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function Login() {
  const { register, handleSubmit } = useForm();
  const navigate = useNavigate();

  const onSubmit = async (data) => {
    try {
      const res = await axios.post("https://auth-project-92rv.onrender.com/login", data);

      // Save token
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);

      // Redirect
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        navigate("/dashboard");
      }

    } catch (err) {
      alert("Login Failed");
    }
  };

  return (
    <div>
      <h2>Login Page</h2>

      <form onSubmit={handleSubmit(onSubmit)}>
        <input {...register("email")} placeholder="Email" required />
        <br /><br />

        <input {...register("password")} type="password" placeholder="Password" required />
        <br /><br />

        <button type="submit">Login</button>
      </form>
    </div>
  );
}

export default Login;