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

const Signup = () => {
  
  const [isLogin, setIsLogin] = useState(false)
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
    const obj = { ...userData, returnSecureToken: true };

    try {
      const response = await axios.post(url, obj, {
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = response.data;

      toast.success("Successfully Logged in", { closeOnClick: true });
      
      localStorage.setItem("idToken", data.accessToken);
      localStorage.setItem("userName", data.displayName);
      localStorage.setItem("userEmail", data.email);
      dispatch(authActions.setIdToken(data.accessToken));
      dispatch(authActions.setUserEmail(data.email));
      dispatch(authActions.setUserName(data.displayName));
      dispatch(authActions.setEmailVerified(data.emailVerified))

      console.log(data);
      navigate("/");
    } catch (error) {
      toast.error("Failed to Login", { closeOnClick: true });
      console.log(error.response?.data?.error?.message || error.message);
    }
  };

  const handleGoogleSignIn = () =>{
    signInWithPopup(auth, provider).then(result=>{
        const user = result.user
        console.log(user);
        toast.success("Successfully Logged in", { closeOnClick: true });
      
        localStorage.setItem("idToken", user.accessToken);
        localStorage.setItem("userName", user.displayName);
        localStorage.setItem("userEmail", user.email);
        dispatch(authActions.setIdToken(user.accessToken));
        dispatch(authActions.setUserEmail(user.email));
        dispatch(authActions.setUserName(user.displayName));
        dispatch(authActions.setEmailVerified(user.emailVerified))
        navigate("/");
    }).catch(err=>{
        console.log(err);
    })
  }

  return (
    <div className="signup template d-flex justify-content-center align-items-center vh-100 bg-primary">
      <div className="form_container p-5 rounded bg-white">
        <form onSubmit={handleSubmit}>
          <h3 className="text-center">Sign Up</h3>
          {!isLogin && (
            <div className="mb-2">
              <label htmlFor="fname">First Name</label>
              <input
                type="text"
                placeholder="Enter First Name"
                className="form-control"
                value={userData.firstName}
                onChange={(e)=>setUserData({...userData, firstName: e.target.value})}
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
                onChange={(e)=>setUserData({...userData, lastName:e.target.value})}
              />
            </div>
          )}
          <div className="mb-2">
            <label htmlFor="email">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              className="form-control"
              value={userData.email}
              onChange={(e)=>setUserData({...userData, email: e.target.value})}
              required
            />
          </div>
          <div className="mb-2">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              className="form-control"
              value={userData.password}
              onChange={(e)=>setUserData({...userData, password: e.target.value})}
              required
            />
          </div>

          <div className="d-grid mt-2">
            <button type="submit" className="btn btn-primary">
              {isLogin? "Login" : "Sign Up"}
            </button>
          </div>
          <p className="text-end mt-2">
            <button onClick={()=>setIsLogin(prev=>!prev)} className="ms-2">
              {isLogin? "Already Registerd? Sign Up" : "Login"}
            </button>
          </p>
        </form>
        <div>
          <button className="btn btn-primary d-flex justify-content-center padding-2 mr-2" onClick={handleGoogleSignIn}>
            <img src={google} alt="google icon" width={20} height={20}/>
            <span>Sign In with Google</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default Signup;
