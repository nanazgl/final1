
export const SET_LANGUAGE = 'SET_LANGUAGE';
export const SET_THEME = 'SET_THEME';

export const setLanguage = (language) => ({
    type: SET_LANGUAGE,
    payload: language,
});

export const setTheme = (theme) => ({
    type: SET_THEME,
    payload: theme,
});
