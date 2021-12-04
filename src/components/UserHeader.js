import { Avatar, Typography, Box } from '@mui/material';
import { stringAvatar } from '../util';
import { useNavigate } from 'react-router-dom';

const UserHeader = ({ user }) => {
    let navigate = useNavigate();

    const openProfile = () => {
        navigate(`/profile/${user._id}`);
    }

    return (
        <Box
            onClick={openProfile}
            sx={{
                cursor: 'pointer',
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                mb: 2
            }}>
            <Avatar {...stringAvatar(user.displayName || 'Unknown')} />
            <Typography sx={{ ml: 2, mb: 0 }} variant="subtitle2" gutterBottom component="div">
                {user.displayName || 'Unknown'}
            </Typography>
        </Box>
    )
}

export default UserHeader;
