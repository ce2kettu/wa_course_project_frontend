import { useReducer, useEffect, useState } from 'react';
import { Routes, Route, Navigate, useNavigate } from 'react-router-dom';
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
import EditProfile from './components/EditProfile';
import RequireAuth from './components/RequireAuth';
import RedirectAuth from './components/RedirectAuth';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [isInvalidLogin, setIsInvalidLogin] = useState(false);
  let navigate = useNavigate();

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
              navigate('/login', { replace: true });
            }

            setIsLoading(false);
          }
        })
        .catch(err => {
          setIsLoading(false);
        });
    } else {
      setIsLoading(false);
    }

    return () => {
      isMounted = false;
    }
  }, []);

  const addRoutes = () => {
    if (!isLoading) {
      return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="post/:postId" element={<PostDetail />} />
          <Route path="register" element={
            <RedirectAuth>
              <RegisterForm />
            </RedirectAuth>
          } />
          <Route path="login" element={
            <RedirectAuth>
              <LoginForm />
            </RedirectAuth>
          } />
          <Route path="profile/:userId" element={<UserProfile />} />
          <Route path="editProfile" element={
            <RequireAuth>
              <EditProfile />
            </RequireAuth>
          } />
          <Route path="createPost" element={
            <RequireAuth>
              <CreatePost />
            </RequireAuth>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
  }

  const theme = createTheme({
    palette: {
      mode: "dark",
    }
  });

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{
        state,
        dispatch
      }}>
        <Header />
        <Container component="main">
          {addRoutes()}
        </Container>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
