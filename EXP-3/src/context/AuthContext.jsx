import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      return null;
    }

    try {
      const payload = token.split(".")[1];

      const decodedPayload = JSON.parse(
        atob(payload)
      );

      return {
        username: decodedPayload.username,
        role: decodedPayload.role,
      };
    } catch (error) {
      localStorage.removeItem("token");
      return null;
    }
  });

  const login = (username, password, role) => {
    username = username.trim();

    if (!username || !password || !role) {
      return false;
    }

    // JWT Header
    const header = btoa(
      JSON.stringify({
        alg: "HS256",
        typ: "JWT",
      })
    );

    // JWT Payload
    const payload = btoa(
      JSON.stringify({
        username: username,
        role: role,
      })
    );

    // Mock Signature
    const signature = btoa("secure-signature");

    // JWT Token
    const token = `${header}.${payload}.${signature}`;

    // Save token
    localStorage.setItem("token", token);

    // Save user
    setUser({
      username: username,
      role: role,
    });

    return true;
  };

  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};