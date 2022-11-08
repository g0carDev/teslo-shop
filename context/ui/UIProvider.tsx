import { FC, ReactNode, useReducer } from 'react';
import { UIContext, uiReducer } from './';

export interface UIStateProps {
  isMenuOpen: boolean;
}
interface ProviderProps {
  children: ReactNode;
}

const UI_INITIAL_STATE: UIStateProps = {
  isMenuOpen: false,
};

export const UIProvider: FC<ProviderProps> = ({ children }) => {
  const [state, dispatch] = useReducer(uiReducer, UI_INITIAL_STATE);
  const toggleSideMenu = () => dispatch({ type: '[UI] - ToggleMenu' });
  return (
    <UIContext.Provider
      value={{
        ...state,
        //methods
        toggleSideMenu,
      }}
    >
      {children}
    </UIContext.Provider>
  );
};
