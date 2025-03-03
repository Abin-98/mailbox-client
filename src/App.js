import { Navigate, Route, Routes } from "react-router-dom";
import Signup from "./Pages/Signup";
import "bootstrap/dist/css/bootstrap.min.css";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import Home from "./Pages/Home";
import NavBar from "./Components/NavBar";
import Profile from "./Pages/Profile";

function App() {
  const idToken = useSelector((state) => state.auth.idToken);

  return (
    <>
      <ToastContainer />
      {idToken && <NavBar />}
      <Routes>
        <Route
          path="/"
          element={idToken ? <Home /> : <Navigate to={"/signup"} replace />}
        />
      <Route
        path="/profile"
        element={idToken ? <Profile /> : <Navigate to={"/signup"} replace />}
      />
        <Route path="/signup" element={<Signup />} />
        <Route path="*" element={idToken ? <Home /> : <Signup />} />
      </Routes>
    </>
  );
}

export default App;
