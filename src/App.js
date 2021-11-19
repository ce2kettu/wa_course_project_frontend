import './App.css';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import SignInSide from './components/SignInSide';
import SignUp from './components/SignUp';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { GlobalStyles } from '@mui/styled-engine';

function App() {
  const theme = createTheme({
    palette: {
      mode: "dark",
    }
  });

  return (
    <BrowserRouter>
      <CssBaseline />
      <ThemeProvider theme={theme}>
        <Header />
        <Container component="main">
          <Routes>
            <Route path="/" />
            <Route path="register" element={<SignUp />} />
            <Route path="login" element={<SignInSide />} />
          </Routes>
        </Container>
      </ThemeProvider>
    </BrowserRouter >
  );
}

export default App;
