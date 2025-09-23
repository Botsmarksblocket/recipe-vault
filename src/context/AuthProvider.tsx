import { createContext} from "react";
import type User from "../interfaces/User";

interface AuthContextType {
  user: User | null;
  loginUser: (email: string, password: string) => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);