import { Alert, Avatar, Container, Typography, Box, Card, CardContent } from '@mui/material';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Config from '../config';
import { stringAvatar } from '../util';

const UserProfile = () => {
  const [error, setError] = useState('');
  const [user, setUser] = useState(null);
  let params = useParams();
  const displayName = user ? user.displayName : 'Unknown';

  // Fetch profile and display it
  useEffect(() => {
    let isMounted = true;

    fetch(`${Config.apiUrl}/api/users/profile/${params.userId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isMounted) {
            document.title = `${data.profile.displayName || 'Unknown'} - Heapoverflow`;
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
    <Container component="main" maxWidth="xs">
      {error && (
        <Alert severity="error">{error}</Alert>
      )}

      {
        user &&
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <Avatar {...stringAvatar(displayName)} sx={{ width: 72, height: 72 }} />
          <Typography component="h1" variant="h5" sx={{ mt: 2 }}>
            {displayName}
          </Typography>
          <Box sx={{ width: '100%', mt: 4 }}>
            <Card variant="outlined" sx={{ p: 2 }}>
              <CardContent sx={{ p: 1 }}>
                <Typography sx={{ fontSize: 14 }} color="primary.main" gutterBottom>
                  Registered at {user.createdAt ? new Date(user.createdAt).toLocaleString('en-US') : 'unknown'}
                </Typography>
                <Typography sx={{ fontSize: 14 }} color="text.primary" gutterBottom>
                  User bio
                </Typography>
                <Typography variant="body2">
                  {user.bio ? user.bio : (
                    <Alert severity="error" sx={{ mt: 2 }}>This user has no bio</Alert>
                  )}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      }
    </Container>
  )
}

export default UserProfile;
