import { useContext, useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';
import { Avatar, Menu, MenuItem, Button, Typography, ListItem, ListItemButton, List, ListItemText, Drawer, Box } from '@mui/material';

const MobileDrawer = (props) => {
  const { state: authState, dispatch } = useContext(AuthContext);
  const [anchorEl, setAnchorEl] = useState(null);
  let navigate = useNavigate();

  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const logout = () => {
    handleClose();
    dispatch({ type: 'LOGOUT' });
    navigate('/');
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
        <Typography variant="h6" color="inherit" noWrap
          sx={{ flexGrow: 1, padding: 2, textDecoration: 'none' }} component={RouterLink} to="/">
          heapover<span style={{ "color": "#ff3300" }}>flow</span>
        </Typography>
        <List>
          {
            props.navigation.map(item =>
              <ListItem key={item.name} disablePadding onClick={() => props.setOpenDrawer(false)}>
                <ListItemButton component={RouterLink} to={item.path}>
                  <ListItemText primary={item.name} />
                </ListItemButton>
              </ListItem>
            )
          }
        </List>
        {
          !authState.isAuthenticated && (
            <>
              <Button component={RouterLink} to='/login' variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={() => props.setOpenDrawer(false)}>
                Login
              </Button>
              <Button component={RouterLink} to='/register' variant="outlined" sx={{ my: 1, mx: 1.5 }} onClick={() => props.setOpenDrawer(false)}>
                Register
              </Button>
            </>
          )
        }

        {
          authState.isAuthenticated && (
            <>
              <Avatar sx={{ m: 1, bgcolor: 'secondary.main', cursor: 'pointer' }} onClick={handleClick}>
              </Avatar>
              <Menu
                id="basic-menu"
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
                MenuListProps={{
                  'aria-labelledby': 'basic-button',
                }}
              >
                <MenuItem onClick={handleClose}>My Profile</MenuItem>
                <MenuItem onClick={logout}>Logout</MenuItem>
              </Menu>
            </>
          )
        }
      </Box>
    </Drawer>
  );
}
export default MobileDrawer;
