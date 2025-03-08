import { Routes, Route } from "react-router-dom";
// import Login from "../pages/Login";
import Register from "../pages/Register";
import MediaPlayer from "../pages/MediaPlayer";
import MediaTrimEditor from '../components/VideoEditor';
import GoogleAuth from '../components/GoogleAuth';
import Layout from '../pages/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/discover" element={<Layout />} />
      <Route path="/top-streamers" element={<Layout />} />
      <Route path="/configurations" element={<Layout />} />
      <Route path="/configurations/my-media" element={<Layout />} />
      <Route path="/create-media" element={<Layout />} />
      <Route path="/credits" element={<Layout />} />
      <Route path="/my-media" element={<Layout />} />
      <Route path="/my-editors" element={<Layout />} />
      <Route path="/login" element={<GoogleAuth />} />
      <Route path="/register" element={<Register />} />
      <Route path="/media/player/:token" element={<MediaPlayer />} />
      <Route path="/video-editor" element={<MediaTrimEditor />} />
    </Routes>
  );
};

export default AppRoutes;