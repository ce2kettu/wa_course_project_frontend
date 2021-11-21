import * as React from 'react';
import Drawer from '@mui/material/Drawer';
import ListItemText from '@mui/material/ListItemText';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { Link as RouterLink } from 'react-router-dom';

const MobileDrawer = (props) => {
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
      </Box>
    </Drawer>
  );
}
export default MobileDrawer;
