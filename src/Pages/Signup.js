import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../index.css";
import { toast } from "react-toastify";
import { useDispatch } from "react-redux";
import { auth, provider } from "../FirebaseConfig";
import { authActions } from "../Store/reducers/authSlice";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import google from "../assets/google.png";
import logo from '../assets/logo.png'

const Signup = () => {
  const [isLogin, setIsLogin] = useState(false);
  const [userData, setUserData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
  });
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleSubmit = async (e) => {
    e.preventDefault();

    let url = "";
    if (isLogin) {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyBI9g18LwCfyjAleWIYwQgyRtd9K7XVgkc";
    } else {
      url =
        "https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyBI9g18LwCfyjAleWIYwQgyRtd9K7XVgkc";
    }
    const obj = {
      email: userData.email,
      password: userData.password,
      returnSecureToken: true,
    };

    try {
      const response = await axios.post(url, obj, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      toast.success("Successfully Logged in", { closeOnClick: true });

      localStorage.setItem("idToken", data.idToken);
      localStorage.setItem("userEmail", data.email);
      localStorage.setItem("userName", data.displayName);
      dispatch(authActions.setIdToken(data.idToken));
      dispatch(authActions.setUserEmail(data.email));
      dispatch(authActions.setEmailVerified(data.emailVerified));
      dispatch(
        authActions.setUserName(
          data.displayName
            ? data.displayName
            : userData.firstName + userData.lastName
        )
      );

      console.log(data);
      navigate("/");
    } catch (error) {
      toast.error("Failed to Login", { closeOnClick: true });
      console.log(error.response?.data?.error?.message || error.message);
    }
  };

  const handleGoogleSignIn = () => {
    signInWithPopup(auth, provider)
      .then((result) => {
        const user = result.user;
        console.log(user);
        toast.success("Successfully Logged in", { closeOnClick: true });

        localStorage.setItem("idToken", user.accessToken);
        localStorage.setItem("userName", user.displayName);
        localStorage.setItem("userEmail", user.email);
        dispatch(authActions.setIdToken(user.accessToken));
        dispatch(authActions.setUserEmail(user.email));
        dispatch(authActions.setUserName(user.displayName));
        dispatch(authActions.setEmailVerified(user.emailVerified));
        navigate("/");
      })
      .catch((error) => {
        toast.error("Failed to Login", { closeOnClick: true });
        console.log(error.response?.data?.error?.message || error.message);
      });
  };

  return (
    <div className="signup template d-flex justify-content-center align-items-center min-vh-100 bg-signup">
      <img src={logo} alt="logo" width={200} height={90} className="position-absolute top-0 p-4"/>
      <div className="form_container p-2 rounded bg-white">
        <div className="row w-100 h-100 px-3 py-1">
          
          <div
            className={`col-lg-6 ${isLogin && "order-2"}  col-12 bg-signup-interior border`}
            style={{ minHeight: "40rem" }}
          ></div>
          <div
            className={`col-lg-6 ${isLogin && "order-1"} col-12 h-100 p-5 rounded bg-white`}
            style={{ minHeight: "40rem" }}
          >
            <form onSubmit={handleSubmit}>
              <h3 className="text-center">{isLogin ? "Login" : "Sign Up"}</h3>
              {!isLogin && (
                <div className="mb-2">
                  <label htmlFor="fname">First Name*</label>
                  <input
                    type="text"
                    placeholder="Enter First Name"
                    className="form-control"
                    value={userData.firstName}
                    onChange={(e) =>
                      setUserData({ ...userData, firstName: e.target.value })
                    }
                    required
                  />
                </div>
              )}
              {!isLogin && (
                <div className="mb-2">
                  <label htmlFor="lname">Last Name</label>
                  <input
                    type="text"
                    placeholder="Enter Last Name"
                    className="form-control"
                    value={userData.lastName}
                    onChange={(e) =>
                      setUserData({ ...userData, lastName: e.target.value })
                    }
                  />
                </div>
              )}
              <div className="mb-2">
                <label htmlFor="email">Email*</label>
                <input
                  type="email"
                  placeholder="Enter Email"
                  className="form-control"
                  value={userData.email}
                  onChange={(e) =>
                    setUserData({ ...userData, email: e.target.value })
                  }
                  required
                />
              </div>
              <div className="mb-2">
                <label htmlFor="password">Password*</label>
                <input
                  type="password"
                  placeholder="Enter Password"
                  className="form-control"
                  value={userData.password}
                  onChange={(e) =>
                    setUserData({ ...userData, password: e.target.value })
                  }
                  required
                />
              </div>

              <div className="d-grid mt-2">
                <button type="submit" className="btn btn-primary">
                  {isLogin ? "Login" : "Sign Up"}
                </button>
              </div>
              <p className="text-end mt-2">
                <button
                  onClick={() => setIsLogin((prev) => !prev)}
                  className="btn btn-outline-dark ms-2"
                >
                  {isLogin ? "New Here? Sign Up" : "Already Registerd? Login here"}
                </button>
              </p>
            </form>
            <div className="w-full mt-5">
              <button
                className="btn btn-light d-flex gap-3 align-items-center justify-content-center mx-auto border"
                onClick={handleGoogleSignIn}
              >
                <img src={google} alt="google icon" width={20} height={20} />
                <span>Sign In with Google</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;
