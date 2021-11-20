import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import { useMediaQuery, useTheme } from '@mui/material';
import MobileDrawer from './MobileDrawer';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { React, useState } from 'react';
import { Link as RouterLink } from 'react-router-dom';

const Header = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const [openDrawer, setOpenDrawer] = useState(false);

  const navigation = [{
    name: 'Contact', path: '/contact'
  },
  {
    name: 'Features', path: '/features'
  },
  {
    name: 'Support', path: '/support'
  },
  ];

  return <AppBar
    position="sticky"
    color="default"
    elevation={0}
    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      {isMobile ? (
        <IconButton onClick={() => setOpenDrawer(!openDrawer)}>
          <MenuIcon />
        </IconButton>) : (<></>)
      }
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1, textDecoration: 'none' }} component={RouterLink} to="/">
        heapover<span style={{ "color": "#ff3300" }}>flow</span>
      </Typography>
      {isMobile ? (
        <MobileDrawer navigation={navigation}
          openDrawer={openDrawer} setOpenDrawer={setOpenDrawer} />
      ) : (
        <>
          <nav>
            {
              navigation.map(item =>
                <Link
                  variant="button"
                  underline="none"
                  color="text.primary"
                  href={item.path}
                  sx={{ my: 1, mx: 1.5 }}
                >
                  {item.name}
                </Link>
              )
            }
          </nav>
          <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
            Login
          </Button>
        </>
      )}
    </Toolbar>
  </AppBar>
}

export default Header;
