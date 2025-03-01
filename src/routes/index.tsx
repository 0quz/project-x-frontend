import { Routes, Route } from "react-router-dom";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MediaPlayer from "../pages/MediaPlayer";
import MediaTrimEditor from '../components/VideoEditor';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/media/player/:token" element={<MediaPlayer />} />
      <Route path="/video-editor" element={<MediaTrimEditor />} />
    </Routes>
  );
};

export default AppRoutes;