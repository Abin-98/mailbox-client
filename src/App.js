import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import { useDispatch, useSelector } from "react-redux";
import { toast, ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import NavBar from "./Components/NavBar";
import { useEffect } from "react";
import axios from "axios";
import { mailActions } from "./Store/reducers/mailSlice";

function App() {
  const idToken = useSelector((state) => state.auth.idToken);
  const dispatch = useDispatch();
  const userEmail = useSelector((state) => state.auth.userEmail);
  const emailEncoded = userEmail.replace(/\./g, "_");

  useEffect(() => {
    const controller = new AbortController();

    const fetchData = async () => {
      try {
        const response = await axios.get(
          `https://mailbox-client-a6c40-default-rtdb.firebaseio.com/mails/${emailEncoded}.json`,
          {
            signal: controller.signal,
          }
        );
        console.log(response.data);
        dispatch(mailActions.addToMailList(response.data));
        
      } catch (error) {
        if (axios.isCancel(error)) {
          toast.error(`Request canceled: ${error.message}`);
        } else {
          toast.error(`Error fetching data: ${error}`);
        }
      }
    };

    fetchData();

    return () => {
      controller.abort();
    };
  }, []);
  return (
    <>
      <ToastContainer />

      {!!idToken && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={!!idToken ? <Home /> : <Navigate to={"/signup"} replace />}
        />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    </>
  );
}

export default App;
