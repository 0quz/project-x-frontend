import React from "react";
import { GoogleOAuthProvider, GoogleLogin, googleLogout } from "@react-oauth/google";
import axios from "axios";

const clientId = "1078855318957-r0h6o0pshoqos0mjdkuoppsv3775s4dq.apps.googleusercontent.com";

interface AuthResponse {
  token: string;
}

const GoogleAuth: React.FC = () => {
  const handleSuccess = async (credentialResponse: any) => {
    try {
      // Send token to backend for verification
      const res = await axios.post<AuthResponse>(
        "http://localhost:8080/auth/google",
        { token: credentialResponse.credential },
        { withCredentials: true }
      );

      // Save JWT token from backend
      localStorage.setItem("token", res.data.token);
      window.location.href = "/discover";
    } catch (error) {
      console.error("Login error", error);
    }
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