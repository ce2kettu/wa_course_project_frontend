import { useContext, useEffect, useState } from 'react';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { Alert, Container, Typography, Grid, Box, Link, TextField, Button, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';
import config from '../config';

const LoginForm = () => {
  const { state: authState, dispatch } = useContext(AuthContext);
  let navigate = useNavigate();
  let location = useLocation();
  const from = location.state?.from?.pathname || '/';


  const initialState = {
    errorMessage: null,
    errors: null,
  }

  useEffect(() => {
    if (authState.isAuthenticated) {
      navigate('/', { replace: true });
      return;
    }

    let timer;
    if (authState.registrationSuccessful) {
      timer = setTimeout(() => {
        dispatch({ type: 'DISMISS_REGISTRATION' })
      }, 3000);
    }

    return () => {
      clearTimeout(timer);
    };
  }, [])

  const [data, setData] = useState(initialState);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    fetch(`${config.apiUrl}/api/users/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.get('email'),
        password: data.get('password'),
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch({
            type: 'LOGIN',
            payload: data
          });
          navigate(from, { replace: true });
        } else {
          data.errors ?
            setData({ ...data, errors: data.errors }) :
            setData({ ...data, errorMessage: data.message });
        }
      })
      .catch(err => setData({ ...data, errorMessage: 'Unknown error' }));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        {authState.registrationSuccessful && (
          <Alert severity="success" sx={{ mb: 2 }}>Registration successful</Alert>
        )}

        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign in
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoComplete="email"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            name="password"
            label="Password"
            type="password"
            id="password"
            autoComplete="current-password"
          />

          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign In
          </Button>
          <Grid container>
            <Grid item>
              <Link component={RouterLink} to="/register" variant="body2" underline="none">
                {"Don't have an account? Sign Up"}
              </Link>
            </Grid>
          </Grid>
          {data.errorMessage && (
            <Alert severity="error" sx={{ mt: 1 }}>{data.errorMessage}</Alert>
          )}

          {data.errors && (
            <Alert severity="error" sx={{ mt: 1 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                {
                  data.errors.map(err =>
                    <span key={`${err.param}.${err.msg}`}>{err.param}: {err.msg}</span>
                  )
                }
              </Box>
            </Alert>
          )}
        </Box>
      </Box>
    </Container>
  );
}

export default LoginForm;
