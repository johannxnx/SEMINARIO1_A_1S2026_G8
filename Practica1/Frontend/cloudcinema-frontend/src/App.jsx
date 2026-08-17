import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Gallery from "./pages/Gallery";
import EditarPerfil from "./pages/EditarPerfil";
import Playlist from "./pages/Playlist";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/gallery" element={<Gallery />} />
        <Route path="/edit-profile" element={<EditarPerfil />} />
        <Route path="/playlist" element={<Playlist />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;