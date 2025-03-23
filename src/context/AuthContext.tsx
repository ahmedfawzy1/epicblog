import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";
import { User } from "../types/User";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  useEffect(() => {
    let mounted = true;

    // Check authentication status on mount
    const checkAuth = async () => {
      if (!mounted) return;

      try {
        const response = await axios.get(`${import.meta.env.VITE_API_URL}/api/user`, {
          withCredentials: true,
        });
        if (mounted) {
          setUser(response.data.data);
        }
      } catch (error: any) {
        // Silently handle 401 errors as they're expected when not logged in
        if (error.response?.status !== 401) {
          console.error("Auth check failed:", error);
        }
        if (mounted) {
          setUser(null);
        }
      }
    };

    checkAuth();

    return () => {
      mounted = false;
    };
  }, [isLoggingOut]);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/login`, { email, password }, { withCredentials: true });
      setUser(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Login failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.post(`${import.meta.env.VITE_API_URL}/api/user/register`, { name, email, password }, { withCredentials: true });
      setUser(response.data.data);
    } catch (error: any) {
      setError(error.response?.data?.message || "Registration failed");
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setIsLoggingOut(true);
      setLoading(true);
      setError(null);
      await axios.post(`${import.meta.env.VITE_API_URL}/api/user/logout`, {}, { withCredentials: true });
      setUser(null);
    } catch (error: any) {
      setError(error.response?.data?.message || "Logout failed");
      throw error;
    } finally {
      setLoading(false);
      setIsLoggingOut(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        loading,
        error,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
