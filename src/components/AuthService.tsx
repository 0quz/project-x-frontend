import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/auth", // Replace with your API base URL
    headers: {
      "Content-Type": "application/json",
    },
  });

interface LoginData {
  email: string;
  password: string;
}

export const login = async (data: LoginData) => {
  try {
    const response = await api.post("/login", data);
    return response.data;
  } catch (error) {
    console.error("Login failed", error);
    throw error;
  }
};

export const register = async (data: LoginData) => {
    try {
        const response = await api.post("/register", data);
        return response.data;
    } catch (error) {
        console.error("Register failed", error);
        throw error;
    }
};