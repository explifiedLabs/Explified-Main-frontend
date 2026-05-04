// src/services/authService.js
import axios from "axios";

const API_URL = "https://cmsapi-pf6diz22ka-uc.a.run.app/api/auth/";

const login = async (userData) => {
  const response = await axios.post(
    `${API_URL}login`,
    {
      emailId: userData.email,
      password: userData.password,
    },
    {
      withCredentials: true,
      headers: {
        "Content-Type": "application/json",
      },
    }
  );

  if (response.data) {
    localStorage.setItem("user", JSON.stringify(response.data));
  }

  return response.data;
};

const logout = async () => {
  const response = await axios.post(
    `${API_URL}logout`,
    {},
    { withCredentials: true }
  );

  localStorage.removeItem("user");

  return response.data; 
};

export default {
  login,
  logout,
};