import { createContext, useContext, useEffect, useState } from "react";
import axiosInstance from "../lib/axios";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../lib/firebase";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check Auth
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const { data } = await axiosInstance.get("/auth/me");

        setUser(data.user);
      } catch (error) {
        console.log(error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const loginWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const idToken = await result.user.getIdToken();
      const { data } = await axiosInstance.post("/auth/google", { idToken });
      setUser(data.user);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const login = async ({ email, password }) => {
    try {
      const { data } = await axiosInstance.post("/auth/login", {
        email,
        password,
      });

      setUser(data.user);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  const register = async ({ name, email, password }) => {
    try {
      const { data } = await axiosInstance.post("/auth/register", {
        name,
        email,
        password,
      });

      setUser(data.user);

      return data;
    } catch (error) {
      console.log(error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await axiosInstance.post("/auth/logout");

      setUser(null);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        loginWithGoogle,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
};
