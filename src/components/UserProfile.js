import { Alert, Avatar, Container, Typography, Box } from '@mui/material';
import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Config from '../config';
import { stringAvatar } from '../util';

const UserProfile = () => {
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  let params = useParams();

  // Fetch profile
  useEffect(() => {
    let isMounted = true;

    fetch(`${Config.apiUrl}/api/users/profile/${params.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isMounted) {
            document.title = `${data.profile.displayName} - Heapoverflow`;
            setUser(data.profile);
          }
        } else {
          setError('Could not fetch user profile.');
        }
      })
      .catch(err => setError('Could not fetch user profile.'));

    return () => {
      isMounted = false;
    }
  }, []);

  return (
    <Container sx={{ mt: 5 }}>
      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {
        user &&
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Avatar {...stringAvatar(user.displayName || 'Unknown')} sx={{ width: 72, height: 72 }} />
          <Typography sx={{ mt: 5 }} variant="subtitle2" gutterBottom component="div">
            Display name: {user.displayName || 'Unknown'}
          </Typography>
          <Typography sx={{ mt: 5 }} variant="subtitle2" gutterBottom component="div">
            Registered at: {user.createdAt}
          </Typography>
          <Typography sx={{ mt: 5 }} variant="subtitle2" gutterBottom component="div">
            Bio: {user.createdAt}
          </Typography>
        </Box>
      }
    </Container>
  )
}

export default UserProfile;
