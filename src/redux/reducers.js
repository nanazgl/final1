
import { SET_LANGUAGE, SET_THEME } from './actions';

const initialState = {
    selectedLanguage: '',
    selectedTheme: '',
};

const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case SET_LANGUAGE:
            return {
                ...state,
                selectedLanguage: action.payload,
            };
        case SET_THEME:
            return {
                ...state,
                selectedTheme: action.payload,
            };
        default:
            return state;
    }
};

export default rootReducer;
