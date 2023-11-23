import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { checkAuthStatus, loginUser, signupUser } from "../helpers/api-communicator";
import toast from "react-hot-toast";

type User = {
  name: string;
  email: string;
  id:string
};
type UserAuth = {
  isLoggedIn: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
};
const AuthContext = createContext<UserAuth | null>(null);

 export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    async function checkStatus() {
      const token = localStorage.getItem('auth')
      const data = await checkAuthStatus(token)
      console.log(data)
      if (data) {
        setUser({email: data.email, name: data.name, id:data.id})
        setIsLoggedIn(true)
      }
    }
    checkStatus()
  }, []);

  const login = async (email: string, password: string) => {
    const data = await loginUser(email,password);
    if (data) {
      localStorage.setItem('auth', data.token)
      setUser({email: data.email, name: data.name, id:data.id})
      console.log(data)
      setIsLoggedIn(true)
    }
  };
  const signup = async (name: string, email: string, password: string) => {
    const data = await signupUser(name,email,password);
    if (data) {
      localStorage.setItem('auth', data.token)
      setUser({email: data.email, name: data.name, id:data.id})
      console.log(data)
      setIsLoggedIn(true)
    }
  };
  const logout = async () => {
    localStorage.removeItem('auth')
    setIsLoggedIn(false)
    setUser(null)
    toast.success('Logged out')
  }
  const value = {
    user,
    isLoggedIn,
    login,
    logout,
    signup
  }
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
};

export const useAuth = () => useContext(AuthContext)
