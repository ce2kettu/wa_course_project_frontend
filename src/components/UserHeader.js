import { Avatar, Typography, Stack } from '@mui/material';
import { stringAvatar } from '../util';
import { Link as RouterLink } from 'react-router-dom';

const UserHeader = ({ user, color }) => {
  const displayName = user.displayName || 'Unknown';

  return (
    <Stack
      direction="row"
      alignItems="center"
      component={RouterLink}
      to={`/profile/${user._id}`}
      sx={{
        cursor: 'pointer',
        mb: 2
      }}>
      <Avatar {...stringAvatar(displayName || 'Unknown')} />
      <Typography sx={{ ml: 2, mb: 0 }} variant="subtitle2" gutterBottom component="div" color={color}>
        {displayName}
      </Typography>
    </Stack>
  )
}

export default UserHeader;
