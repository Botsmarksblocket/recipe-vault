import { type ReactNode, createContext, useState, useEffect } from "react";
import type User from "../interfaces/User";

interface AuthContextType {
  user: User | null;
  loginUser: (email: string, password: string) => Promise<boolean>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

//Provides authentication context to all children
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = async () => {
    const response = await fetch("/api/login");
    try {
      if (response.ok) {
        const user = await response.json();
        setUser(user);
      } else {
        setUser(null);
      }
    } catch {
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const loginUser = async (email: string, password: string) => {
    try {
      const response = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        await fetchUser();
        return true;
      } else {
        setError("Incorrect email or password.");
        return false;
      }
    } catch (error) {
      console.log("Login failure", error);
      return false;
    }
  };

  //Fetches user after first render
  useEffect(() => {
    fetchUser().finally(() => setLoading(false));
  }, []);

  //Return context provider
  return (
    <AuthContext.Provider value={{ user, loginUser }}>
      {children}
    </AuthContext.Provider>
  );
}
