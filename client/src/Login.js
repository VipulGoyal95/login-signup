import { NavLink, useNavigate } from "react-router-dom";
import "./login.css";
import { useState } from "react";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const handleLogin = async (e) => {
    e.preventDefault();
    await fetch("http://localhost:3001/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      redirect: "follow",
      credentials: "include",
      body: JSON.stringify({
        username: email,
        password: password,
      }),
    })
      .then((result) =>
        result.json().then((data) => {
          if (data === "success") {
            navigate("/");
          }
        })
      )
      .catch((err) => {
        alert("invalid username or password");
      });
  };
  
  const handlelogin2 = () => {
    window.open("http://localhost:3001/auth/google/callback", "_self");
  };

  const handlefacebooklogin = () => {
    window.open("http://localhost:3001/auth/facebook/callback", "_self");
  };
  return (
    <div className="outer-container">
      <div className="inner-container">
        <h1 className="title">Login</h1>
        <form>
          <input
            type="text"
            placeholder="Username/Email"
            onChange={(e) => setEmail(e.target.value)}
          />
          <br></br>
          <input
            type="password"
            placeholder="Password"
            onChange={(e) => setPassword(e.target.value)}
          />
          <NavLink to="/forgotpassword" className="forgot-password">
            Forgot password?
          </NavLink>
          <button type="submit" onClick={handleLogin}>
            Login
          </button>
          <br></br>
        </form>
        <div className="donot-account">
          <p>Don't have an account?</p>
          <NavLink to="/register" className="signup-link">
            Signup
          </NavLink>
        </div>
        <div className="separation">
          <hr className="line"></hr>
          <p className="or-statement">Or</p>
          <hr className="line"></hr>
        </div>
        <div className="signin-special">
          <button
            type="button"
            className="login-with-google-btn"
            onClick={handlelogin2}
          >
            Sign in with Google
          </button>
          <button
            type="button"
            className="login-with-facebook-btn"
            onClick={handlefacebooklogin}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="32"
              height="32"
              viewBox="0 0 32 32"
              version="1"
            >
              <path
                fill="#FFFFFF"
                d="M32 30a2 2 0 0 1-2 2H2a2 2 0 0 1-2-2V2a2 2 0 0 1 2-2h28a2 2 0 0 1 2 2v28z"
              />
              <path
                fill="#4267b2"
                d="M22 32V20h4l1-5h-5v-2c0-2 1.002-3 3-3h2V5h-4c-3.675 0-6 2.881-6 7v3h-4v5h4v12h5z"
              />
            </svg>
            Sign in with Facebook
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
