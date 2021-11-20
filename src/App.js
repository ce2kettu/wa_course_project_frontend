import { useReducer } from "react";
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import LoginForm from './components/LoginForm';
import RegisterForm from './components/RegisterForm';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import HomePage from './components/HomePage';
import NotFound from './components/NotFound';
import { AuthContext, reducer, initialState } from './reducers/auth';

const App = () => {
  const [state, dispatch] = useReducer(reducer, initialState);


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
          <Header />
          <Container component="main">
            <Routes>
              <Route path="/" element={<HomePage />} />
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
