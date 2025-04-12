import { Routes, Route } from "react-router-dom"; 
import UserSetup from "../pages/UserSetup";
import MediaPlayer from "../pages/MediaPlayer";
import Layout from '../pages/Layout';

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Layout />} />
      <Route path="/:username" element={<Layout />} />
      <Route path="/user-setup" element={<UserSetup />} />
      <Route path="/:username/media" element={<Layout />} />
      <Route path="/discover" element={<Layout />} />
      <Route path="/top-streamers" element={<Layout />} />
      <Route path="/configurations" element={<Layout />} />
      <Route path="/dashboard/my-stream" element={<Layout />} />
      <Route path="/dashboard/my-editors" element={<Layout />} />
      <Route path="/dashboard/my-streamers" element={<Layout />} />
      <Route path="/dashboard/my-media" element={<Layout />} />
      <Route path="/editor/streamer/:username" element={<Layout />} />
      <Route path="/create-media" element={<Layout />} />
      <Route path="/credits" element={<Layout />} />
      {/* <Route path="/my-media" element={<Layout />} /> */}
      <Route path="/media/player/:token" element={<MediaPlayer />} />
      {/* <Route path="/:username/media" element={<CustomerDashboard />} /> */}
    </Routes>
  );
};

export default AppRoutes;