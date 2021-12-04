import { useContext } from 'react';
import { Container, Box, Avatar, Typography, TextField, Button } from '@mui/material';
import { AuthContext } from '../reducers/auth';
import { SnackbarContext } from '../SnackbarContext';
import { createMessage } from '../util';
import Config from '../config';

const EditProfile = () => {
  const { state: authState, dispatch } = useContext(AuthContext);
  const { setSnackPack } = useContext(SnackbarContext);

  // Edit profile on server
  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    fetch(`${Config.apiUrl}/api/users/editProfile`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        displayName: data.get('displayName'),
        bio: data.get('bio'),
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          dispatch({
            type: 'LOGIN',
            payload: {
              user: data.profile,
              token: authState.token
            }
          });
          setSnackPack((prev) => [...prev, createMessage('Profile saved!', 'success')]);
        } else {
          setSnackPack((prev) => [...prev, createMessage('Could not save profile.', 'error')])
        }
      })
      .catch(err => setSnackPack((prev) => [...prev, createMessage('Please try again.', 'error')]));
  }

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
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main', width: 64, height: 64 }} />
        <Typography component="h1" variant="h5">
          My profile
        </Typography>
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            disabled
            value={authState.user.email}
            label="E-mail address"
            type="text"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            defaultValue={authState.user.displayName}
            label="Display Name"
            name="displayName"
            type="text"
            autoFocus
          />
          <TextField
            margin="normal"
            required
            fullWidth
            defaultValue={authState.user.bio}
            name="bio"
            label="Bio"
            type="text"
            multiline
            maxRows={4}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2 }}
          >
            Save
          </Button>
        </Box>
      </Box>
    </Container>
  )
}

export default EditProfile;
