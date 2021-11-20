import './App.css';
import * as React from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GlobalStyles } from '@mui/styled-engine';
import HomePage from './components/HomePage';

export const AuthContext = React.createContext();

const initialState = {
  isAuthenticated: false,
  user: null,
  token: null,
};
const reducer = (state, action) => {
  switch (action.type) {
    case "LOGIN":
      localStorage.setItem("user", JSON.stringify(action.payload.user));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      return {
        ...state,
        isAuthenticated: true,
        user: action.payload.user,
        token: action.payload.token
      };
    case "LOGOUT":
      localStorage.removeItem('token');
      return {
        ...state,
        isAuthenticated: false,
        user: null
      };
    default:
      return state;
  }
};

const App = () => {
  const [state, dispatch] = React.useReducer(reducer, initialState);


  const theme = createTheme({
    palette: {
      mode: "dark",
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <CssBaseline />
        <AuthContext.Provider>
          <Header />
          <Container component="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="register" element={<RegisterForm />} />
              <Route path="login" element={<LoginForm />} />
              <Route path="*" element={
                <main style={{ padding: "1rem" }}>
                  <p>There's nothing here!</p>
                </main>
              } />
            </Routes>
          </Container>
        </AuthContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
