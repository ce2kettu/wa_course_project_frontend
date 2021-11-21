import { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Alert from '@mui/material/Alert';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import config from '../config';

const RegisterForm = () => {
  const initialState = {
    errorMessage: null,
    errors: null,
  }

  const [data, setData] = useState(initialState);
  let navigate = useNavigate();

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
              <Box sx={{display: 'flex', flexDirection: 'column'}}>
              {
                data.errors.map(err =>
                  <span>{err.param}: {err.msg}</span>
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
