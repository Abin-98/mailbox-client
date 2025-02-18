import axios from "axios";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import CheckCircleOutlineIcon from "@mui/icons-material/CheckCircleOutline";
import CancelIcon from "@mui/icons-material/Cancel";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { authActions } from "../Store/reducers/authSlice";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const userName = useSelector((state) => state.auth.userName);
  const userProfilePic = useSelector((state) => state.auth.userProfilePic);
  const userEmail = useSelector((state) => state.auth.userEmail);
  const emailVerified = useSelector(state=>state.auth.emailVerified)
  const navigate = useNavigate()

  const [updatedInfo, setUpdatedInfo] = useState({
    name: "",
    profilePic: "",
  });

  useEffect(() => {
    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIzaSyBI9g18LwCfyjAleWIYwQgyRtd9K7XVgkc",
        { idToken: idToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((res) => {
        console.log("user data", res.data?.users[0]);

        dispatch(authActions.setEmailVerified(res.data?.users[0]?.emailVerified))
        dispatch(authActions.setProfilePic(res.data?.users[0]?.photoUrl));

        setUpdatedInfo({
          name: res.data?.users[0]?.displayName,
          profilePic: res.data?.users[0]?.photoUrl,
        });
      })
      .catch((err) => {
        toast.error("Failed to get User info", { closeOnClick: true });
        console.log(err)
        });
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:update?key=AIzaSyBI9g18LwCfyjAleWIYwQgyRtd9K7XVgkc",
        {
          idToken: idToken,
          displayName: updatedInfo.name,
          photoUrl: updatedInfo.profilePic,
          returnSecureToken: true,
        },
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then((res) => {
        toast.success("Successfully updated details", { closeOnClick: true });
        if (userName !== updatedInfo.name)
          dispatch(authActions.setUserName(updatedInfo.name));
        if (userProfilePic !== updatedInfo.profilePic)
          dispatch(authActions.setProfilePic(updatedInfo.profilePic));
        console.log(res);
      })
      .catch((err) => {
        toast.error("Failed to Update", { closeOnClick: true });
        console.log(err);
      });
  };

  const handleVerify = () => {
    axios
      .post(
        "https://identitytoolkit.googleapis.com/v1/accounts:sendOobCode?key=AIzaSyBI9g18LwCfyjAleWIYwQgyRtd9K7XVgkc",
        { requestType: "VERIFY_EMAIL", idToken: idToken },
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      )
      .then((data) => {
        console.log(data);
        toast.success("Email verification link sent!");
        dispatch(authActions.setEmailVerified(data?.user?.emailVerified))
      })
      .catch((err) => {
        console.log(err);
        if (err?.code == "auth/invalid-id-token") {
          toast.error("Session expired! Please login again");
        } else if (err?.message == "auth/user-not-found") {
          toast.error("User not found! Please Sign up");
        }
        dispatch(authActions.setIdToken(""));
        dispatch(authActions.setUserName(""));
        dispatch(authActions.setUserEmail(""));
        dispatch(authActions.setProfilePic(""));

        localStorage.clear();
        navigate("/signup");
      });
  };

  return (
      <section className="h-100 d-flex justify-content-center">
        <div className="d-flex flex-column container-md p-5 m-1 shadow-lg">
          <div className="d-flex flex-column align-items-center justify-content-center py-2">
            <h1 className="fs-3 mb-2">Your Account</h1>
            {userProfilePic ? (
              <img
                src={userProfilePic}
                alt="profile pic"
                className="rounded-circle"
                width={200}
                height={200}
                referrerPolicy="no-referrer"
              />
            ) : (
              <AccountCircleIcon
                className="text-primary"
                style={{ fontSize: 90 }}
              />
            )}
          </div>
          <form className="d-flex flex-column gap-3 mt-4" onSubmit={handleSubmit}>
            <div className="d-flex flex-column gap-1 align-items-start mb-2">
              <label className="h6">Name</label>
              <input
                className="w-100 border-2 p-2 form-control"
                type="text"
                placeholder="Full Name"
                value={updatedInfo.name}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, name: e.target.value })
                }
                required
              />
            </div>
            <div className="d-flex flex-column gap-1 align-items-start mb-2">
              <label className="fs-6">Email</label>
              <span className="w-100 border-2 p-2 form-control">
                {userEmail}
              </span>
            </div>
            <div className="d-flex flex-column gap-1 align-items-start">
              <label className="h6">Profile Pic Url</label>
              <input
                className="w-100 border-2 p-2 form-control"
                type="text"
                placeholder="Profile Pic"
                value={updatedInfo.profilePic}
                onChange={(e) =>
                  setUpdatedInfo({ ...updatedInfo, profilePic: e.target.value })
                }
              />
            </div>
            <button
              type="submit"
              className="text-light btn btn-warning p-2 my-3 w-100"
            >
              Update
            </button>
          </form>
          <button
            onClick={handleVerify}
            className="btn btn-primary px-4 py-2 my-2 w-100"
          >
            Verify Email
          </button>
          {emailVerified ? (
            <span>
              {"Account Verified "}
              <CheckCircleOutlineIcon className="text-success" />
            </span>
          ) : (
            <span>
              {"Your Account is Not Verified! "}
              <CancelIcon className="text-danger" />
            </span>
          )}
        </div>
      </section>
  );
};

export default Profile;
