import { type FC, type ReactNode, useReducer, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useSession, signOut } from "next-auth/react"
import Cookies from 'js-cookie';
import axios from 'axios';
import { tesloApi } from '@api';
import { AuthContext, authReducer } from './';
import type { IUser } from '@interfaces';

export interface AuthStateProps {
  isLoggedIn: boolean;
  user?: IUser;
}
interface ProviderProps {
  children: ReactNode;
}

const AUTH_INITIAL_STATE: AuthStateProps = {
  isLoggedIn: false,
  user: undefined,
};

export const AuthProvider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, AUTH_INITIAL_STATE);
  const router = useRouter();
  const { data, status } = useSession();

  useEffect(() => {
    if (status === 'authenticated') {
      dispatch({ type: '[Auth] - Login', payload: data.user as IUser });
    }
  }, [data, status]);

  // useEffect(() => {
  //   validateToken();
  // }, []);

  const validateToken = async () => {
    if (!Cookies.get('token')) return;
    try {
      const { data } = await tesloApi.get('/user/validate-token');
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
    } catch (error) {
      console.log(error);
      Cookies.remove('token');
    }
  };

  const loginUser = async (email: string, password: string): Promise<boolean> => {
    try {
      const { data } = await tesloApi.post('/user/login', { email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return true;
    } catch (error) {
      return false;
    }
  };
  const logoutUser = async () => {
    // Cookies.remove('token');
    Cookies.remove('cart');
    Cookies.remove('firstName');
    Cookies.remove('lastName');
    Cookies.remove('address');
    Cookies.remove('address2');
    Cookies.remove('city');
    Cookies.remove('zip');
    Cookies.remove('country');
    Cookies.remove('phone');
    signOut();
    // router.reload();
  }

  const registerUser = async (
    name: string,
    email: string,
    password: string
  ): Promise<{
    hasError: boolean;
    message?: string;
  }> => {
    try {
      const { data } = await tesloApi.post('/user/register', { name, email, password });
      const { token, user } = data;
      Cookies.set('token', token);
      dispatch({ type: '[Auth] - Login', payload: user });
      return {
        hasError: false,
      };
    } catch (error) {
      if (axios.isAxiosError(error)) {
        return {
          hasError: true,
          message: error.response?.data.message,
        };
      }
      return {
        hasError: true,
        message: 'No se pudo registrar el usuario - intentelo más tarde',
      };
    }
  };
  return (
    <AuthContext.Provider
      value={{
        ...state,
        //methods
        loginUser,
        registerUser,
        logoutUser
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
