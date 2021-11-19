import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';


function Header() {
  return <AppBar
    position="sticky"
    color="default"
    elevation={0}
    sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
  >
    <Toolbar sx={{ flexWrap: 'wrap' }}>
      <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
        stackover<span style={{ "color": "#ff3300" }}>glow</span>
      </Typography>
      <nav>
        <Link
          variant="button"
          underline="none"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          Features
        </Link>
        <Link
          variant="button"
          underline="none"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          Enterprise
        </Link>
        <Link
          variant="button"
          underline="none"
          color="text.primary"
          href="#"
          sx={{ my: 1, mx: 1.5 }}
        >
          Support
        </Link>
      </nav>
      <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
        Login
      </Button>
    </Toolbar>
  </AppBar>
}

export default Header;
