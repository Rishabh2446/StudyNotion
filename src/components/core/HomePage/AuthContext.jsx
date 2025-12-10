import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null); // null → no login/signup yet
  const [isSignedUp, setIsSignedUp] = useState(false); // track signup done

  useEffect(() => {
    // on page reload, restore user
    const savedUser = localStorage.getItem("user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    setIsSignedUp(false);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, isSignedUp, setIsSignedUp, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}
