import { createContext } from 'react';

export const AuthContext = createContext();

export const initialState = {
    isAuthenticated: false,
    user: null,
    token: null,
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
        default:
            return state;
    }
};
