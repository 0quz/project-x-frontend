import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";

const clientId = "1078855318957-r0h6o0pshoqos0mjdkuoppsv3775s4dq.apps.googleusercontent.com";

interface AuthResponse {
  token: string;
  username: string | null;
}

interface Props {
  onDone: () => void;
}

const GoogleAuth: React.FC<Props> = ({ onDone }) => {
  const navigate = useNavigate();
  const handleSuccess = async (credentialResponse: any) => {
      // Send token to backend for verification
      const res = await axios.post<AuthResponse>(
        "http://localhost:8080/auth/google/login",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      // Save JWT token from backend
      //Cookies.set("token", res.data.token);
      onDone();
      navigate("/");
  };

  const handleFailure = () => {
    console.error("Google Login Failed");
  };

  return (
    <GoogleOAuthProvider clientId={clientId}>
      <GoogleLogin onSuccess={handleSuccess} onError={handleFailure} />
    </GoogleOAuthProvider>
  );
};

export default GoogleAuth;