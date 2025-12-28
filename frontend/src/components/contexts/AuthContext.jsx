import { createContext, useContext, useEffect, useState } from "react";
import api from "../../api/api";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ MUST start true

  /* 🔁 RESTORE USER ON REFRESH */
  useEffect(() => {
    async function restoreUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const res = await api.get("/auth/me");
        setUser(res.data.user);
      } catch (err) {
        console.error("Auth restore failed", err);
        localStorage.removeItem("token");
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    restoreUser();
  }, []);

  async function signIn(email, password) {
    const res = await api.post("/auth/login", { email, password });
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  async function signUp(data) {
    const res = await api.post("/auth/register", data);
    localStorage.setItem("token", res.data.token);
    setUser(res.data.user);
    return res.data.user;
  }

  function signOut() {
    localStorage.removeItem("token");
    setUser(null);
  }
  function logout() {
    localStorage.removeItem("token");
    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{ user, loading, signIn, signUp, signOut, logout }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
