import { createContext } from 'react';
import type { IUser } from '@interfaces';

interface ContextProps {
  isLoggedIn: boolean;
  user?: IUser;
  loginUser: (email: string, password: string) => Promise<boolean>;
  logoutUser: () => Promise<void>
  registerUser: (
    name: string,
    email: string,
    password: string
  ) => Promise<{
    hasError: boolean;
    message?: string;
  }>;
}
export const AuthContext = createContext<ContextProps>({} as ContextProps);
