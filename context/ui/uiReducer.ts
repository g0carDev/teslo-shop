import { UIStateProps } from './';

type UIActionType = { type: '[UI] - ToggleMenu' }

export const uiReducer = (state: UIStateProps, action: UIActionType): UIStateProps => {
    switch (action.type) {
        case '[UI] - ToggleMenu':
            return { ...state, isMenuOpen: !state.isMenuOpen };
        default:
            return state;
    }
}