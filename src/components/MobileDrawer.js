import { useContext } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';
import { Button, Typography, Drawer, Box } from '@mui/material';

// Side navigation panel for small devices
const MobileDrawer = (props) => {
  const { state: authState, dispatch } = useContext(AuthContext);
  let navigate = useNavigate();

  const logout = () => {
    props.setOpenDrawer(false);
    dispatch({ type: 'LOGOUT' });
    navigate('/');
  }

  const closeDrawer = () => {
    props.setOpenDrawer(false);
  }

  return (
    <Drawer open={props.openDrawer} onClose={() => props.setOpenDrawer(false)}>
      <Box
        sx={{
          width: 250, display: 'flex',
          flexDirection: 'column'
        }}
        role="presentation"
      >
        <Typography
          variant="h6"
          color="inherit"
          noWrap
          sx={{ flexGrow: 1, padding: 2, textDecoration: 'none' }}
          component={RouterLink}
          to="/"
        >
          heapover<span style={{ "color": "#ff3300" }}>flow</span>
        </Typography>
        {
          !authState.isAuthenticated && (
            <>
              <Button
                component={RouterLink}
                to='/login'
                variant="outlined"
                sx={{ my: 1, mx: 1.5 }}
                onClick={closeDrawer}
              >
                Login
              </Button>
              <Button
                component={RouterLink}
                to='/register'
                variant="outlined"
                sx={{ my: 1, mx: 1.5 }}
                onClick={closeDrawer}
              >
                Register
              </Button>
            </>
          )
        }
        {
          authState.isAuthenticated && (
            <>
              <Button
                component={RouterLink}
                to='/editProfile'
                variant="outlined"
                sx={{ my: 1, mx: 1.5 }}
                onClick={closeDrawer}
              >
                My Profile
              </Button>
              <Button variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={logout}>
                Logout
              </Button>
            </>
          )
        }
      </Box>
    </Drawer>
  );
}
export default MobileDrawer;
