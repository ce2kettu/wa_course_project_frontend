import { Typography, Box, Container } from '@mui/material';

const NotFound = () => {
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
        <Typography variant="h2" color="inherit" noWrap>
          404 Not Found
        </Typography>
        <Typography variant="h6" color="inherit" noWrap>
          {"We could not find the page you're looking for! :("}
        </Typography>
      </Box>
    </Container>
  )
}

export default NotFound;
