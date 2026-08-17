import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Gallery from "../pages/Gallery";
import Profile from "../pages/Profile";
import Playlist from "../pages/Playlist";
import PrivateRoute from "../components/PrivateRoute";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gallery" element={<PrivateRoute><Gallery /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><Profile /></PrivateRoute>} />
        <Route path="/playlist" element={<PrivateRoute><Playlist /></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  )
}

export default AppRouter