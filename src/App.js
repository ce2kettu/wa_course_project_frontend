import { useReducer, useEffect, useState } from 'react';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { createTheme, ThemeProvider, CssBaseline, Container, Snackbar, Alert } from '@mui/material';
import { AuthContext, reducer, initialState } from './reducers/auth';
import Config from './config';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import Header from './components/Header';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import QuestionDetail from './components/QuestionDetail';
import AskQuestion from './components/AskQuestion';
import UserProfile from './components/UserProfile';
import EditProfile from './components/EditProfile';
import RequireAuth from './components/RequireAuth';
import RedirectAuth from './components/RedirectAuth';
import { SnackbarContext } from './SnackbarContext';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const [isLoading, setIsLoading] = useState(true);
  const [open, setOpen] = useState(false);
  const [snackPack, setSnackPack] = useState([]);
  const [snack, setSnack] = useState(undefined);
  let navigate = useNavigate();

  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  const handleExited = () => {
    setSnack(undefined);
  };

  const theme = createTheme({
    palette: {
      mode: "dark",
    }
  });

  // Queue snackbar messages
  useEffect(() => {
    if (snackPack.length && !snack) {
      // Set a new snack when we don't have an active one
      setSnack({ ...snackPack[0] });
      setSnackPack((prev) => prev.slice(1));
      setOpen(true);
    } else if (snackPack.length && snack && open) {
      // Close an active snack when a new one is added
      setOpen(false);
    }
  }, [snackPack, snack, open]);

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

  // Wait until authentication is done, so we don't redirect without a reason
  const addRoutes = () => {
    if (!isLoading) {
      return (
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="q/:questionId" element={<QuestionDetail />} />
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
          <Route path="askQuestion" element={
            <RequireAuth>
              <AskQuestion />
            </RequireAuth>
          } />
          <Route path="*" element={<NotFound />} />
        </Routes>
      );
    }
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthContext.Provider value={{
        state,
        dispatch
      }}>
        <SnackbarContext.Provider value={{ snackPack, setSnackPack }}>
          <Snackbar
            key={snack ? snack.key : undefined}
            open={open}
            autoHideDuration={6000}
            message={(snack && snack.type === 'normal') ? snack.message : undefined}
            onClose={handleClose}
            TransitionProps={{ onExited: handleExited }}
          >
            {snack && snack.type !== 'normal' &&
              <Alert onClose={handleClose} severity={snack.type}>
                {snack.message}
              </Alert>
            }
          </Snackbar>
          <Header />
          <Container component="main">
            {addRoutes()}
          </Container>
        </SnackbarContext.Provider>
      </AuthContext.Provider>
    </ThemeProvider>
  );
}

export default App;
