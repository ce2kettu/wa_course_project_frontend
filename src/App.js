import { useReducer, useEffect, useState } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import { AuthContext, reducer, initialState } from './reducers/auth';
import Config from "./config";
import PostDetail from "./components/PostDetail";

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [invalidLogin, setInvalidLogin] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const user = JSON.parse(localStorage.getItem('user') || null);
    const token = JSON.parse(localStorage.getItem('token') || null);

    if (user && token) {
      fetch(`${Config.apiUrl}/api/users/profile`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
        .then(res => res.json())
        .then(data => {
          if (isMounted) {
            if (data.success) {
              dispatch({
                type: 'LOGIN',
                payload: {
                  user: data.profile,
                  token
                }
              });
            } else {
              dispatch({
                type: 'LOGOUT',
              });
              setInvalidLogin(true);
              setInvalidLogin(false);
            }
          }
        })
        .catch(err => console.log(err));
    }

    return () => {
      isMounted = false;
    }
  }, []);

  const theme = createTheme({
    palette: {
      mode: "dark",
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <BrowserRouter>
        <AuthContext.Provider value={{
          state,
          dispatch
        }}>
          {
            invalidLogin &&
            <Navigate to="/login" state={{ replace: true }} />
          }
          <Header />
          <Container component="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="post/:postId" element={<PostDetail />} />
              <Route path="register" element={<RegisterForm />} />
              <Route path="login" element={<LoginForm />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </AuthContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
