import * as React from 'react';

export const AuthContext = React.createContext();

export const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
    registrationSuccessful: false,
};

export const reducer = (state, action) => {
    switch (action.type) {
        case 'LOGIN':
            localStorage.setItem('user', JSON.stringify(action.payload.user));
            localStorage.setItem('token', JSON.stringify(action.payload.token));
            return {
                ...state,
                isAuthenticated: true,
                user: action.payload.user,
                token: action.payload.token
            };
        case 'LOGOUT':
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            return {
                ...state,
                isAuthenticated: false,
                user: null
            };
        case 'REGISTER':
            {
                return {
                    ...state,
                    registrationSuccessful: true
                }
            }
        case 'DISMISS_REGISTRATION':
            {
                console.log('here');
                return {
                    ...state,
                    registrationSuccessful: false
                }
            }
        default:
            return state;
    }
};
