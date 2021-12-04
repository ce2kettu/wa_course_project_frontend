import { useState, useContext, useEffect } from 'react';
import { LockOutlined as LockOutlinedIcon } from '@mui/icons-material';
import { Alert, Container, Typography, Box, Grid, Link, TextField, Button, Avatar } from '@mui/material';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';
import config from '../config';

const RegisterForm = () => {
  const { state: authState, dispatch } = useContext(AuthContext);
  let navigate = useNavigate();

  const initialState = {
    errorMessage: null,
    errors: null,
  }

  const [data, setData] = useState(initialState);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    fetch(`${config.apiUrl}/api/users/register`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email: data.get('email'),
        password: data.get('password'),
        displayName: data.get('displayName'),
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch({
            type: 'REGISTER',
          });
          navigate('/login', { replace: true });
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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box component="form" noValidate onSubmit={handleSubmit} sx={{ mt: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                autoComplete="display-name"
                name="displayName"
                required
                fullWidth
                id="displayName"
                label="Display Name"
                autoFocus
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
              />
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Link component={RouterLink} to="/login" variant="body2" underline="none">
                Already have an account? Sign in
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

export default RegisterForm;
