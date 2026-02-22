import {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from "react";

interface User {
  id: string;
  email: string;
  name?: string;
  username?: string;
}

interface AuthContextType {
  session: User | null;
  user: User | null;
  loading: boolean;
  signUp: (
    email: string,
    password: string,
    name: string,
  ) => Promise<{ error: string | null }>;
  signIn: (
    email: string,
    password: string,
  ) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [session, setSession] = useState<User | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user data on mount
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const userData = JSON.parse(storedUser);
        setUser(userData);
        setSession(userData);
      } catch (error) {
        console.error("Failed to parse stored user data:", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  const signUp = async (email: string, password: string, name: string) => {
    try {
      const response = await fetch("/api/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: email.split("@")[0],
          email,
          name,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        return { error: errorData.error || "Failed to sign up" };
      }

      const userData = await response.json();
      setUser(userData);
      setSession(userData);
      localStorage.setItem("user", JSON.stringify(userData));

      return { error: null };
    } catch (error) {
      console.error("Sign up error:", error);
      return { error: "Failed to sign up" };
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      // For demo purposes, we'll simulate login by checking if user exists
      const response = await fetch("/api/users");
      if (!response.ok) {
        return { error: "Failed to sign in" };
      }

      const users = await response.json();
      const existingUser = users.find((u: User) => u.email === email);

      if (!existingUser) {
        return { error: "User not found" };
      }

      setUser(existingUser);
      setSession(existingUser);
      localStorage.setItem("user", JSON.stringify(existingUser));

      return { error: null };
    } catch (error) {
      console.error("Sign in error:", error);
      return { error: "Failed to sign in" };
    }
  };

  const signOut = async () => {
    setUser(null);
    setSession(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ session, user, loading, signUp, signIn, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
