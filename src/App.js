import { useReducer, useEffect, useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Container } from '@mui/material';
import { AuthContext, reducer, initialState } from './reducers/auth';
import Config from "./config";
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import PostDetail from './components/PostDetail';
import CreatePost from './components/CreatePost';
import UserProfile from './components/UserProfile';
import RequireAuth from './components/RequireAuth';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [invalidLogin, setInvalidLogin] = useState(false);

  // Check if user is already logged in
  useEffect(() => {
    let isMounted = true;

    const user = JSON.parse(localStorage.getItem('user') || null);
    const token = JSON.parse(localStorage.getItem('token') || null);

    // Fetch latest user information
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

              // Navigate to login page
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
              <Route path="profile/:userId" element={<UserProfile />} />
              <Route path="createPost" element={
                <RequireAuth>
                  <CreatePost />
                </RequireAuth>
              } />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </Container>
        </AuthContext.Provider>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
