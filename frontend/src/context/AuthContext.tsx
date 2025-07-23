import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { jwtDecode } from "jwt-decode";

import axios from "../api/axios";


interface DecodedToken {
  exp: number;
  user_id?: string;
  sub?: string;
  email?: string;
  username?:string
}

interface User {
  id: string | null;
  email?: string | null;
  username?:string | null ;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (credentials: {
    email: string;
    password: string;
    username: string;
    password2: string;
  }) => Promise<void>;
  logout: () => Promise<void>;
  refreshAccessToken: () => Promise<boolean>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  const setSession = (token: string | null) => {
    setAccessToken(token);
    if (token) {
      const decoded = jwtDecode<DecodedToken>(token);
      setUser({
        id: decoded.user_id ?? decoded.sub ?? null,
        email: decoded.email ?? null,
        username : decoded.username ,
      });
    } else {
      setUser(null);
    }
  };
  

  const refreshAccessToken = async (): Promise<boolean> => {
    try {
      const res = await axios.post("/refresh-token/");
      const newAccessToken: string = res.data.access;

      setSession(newAccessToken);
      return true;
    } catch {
      setSession(null);
      return false;
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    const res = await axios.post("/login/", credentials);
    setSession(res.data.access);
  };

  const register = async (credentials: { email: string; password: string , username: string ,
    password2: string  }) => {
    const res = await axios.post("/register/", credentials);
    setSession(res.data.access);
  };

  const logout = async () => {
    await axios.post("/logout/");
    setSession(null);
  };

  useEffect(() => {
    (async () => {
      await refreshAccessToken();
      setLoading(false);
    })();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        login,
        register,
        logout,
        refreshAccessToken,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within AuthProvider");
  return context;
};
