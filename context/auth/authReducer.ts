import { AuthStateProps } from './';
import type { IUser } from '@interfaces';

type AuthActionType = { type: '[Auth] - Login'; payload: IUser } | { type: '[Auth] - Logout' };

export const authReducer = (state: AuthStateProps, action: AuthActionType): AuthStateProps => {
  switch (action.type) {
    case '[Auth] - Login':
      return { ...state, user: action.payload, isLoggedIn: true };
    case '[Auth] - Logout':
      return { ...state, user: undefined, isLoggedIn: false };
    default:
      return state;
  }
};
