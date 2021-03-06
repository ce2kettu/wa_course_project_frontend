import { useEffect, useState, useContext, Fragment } from 'react';
import { Alert, List, Stack, Fab, Paper, Divider, Typography, Grid, Box } from '@mui/material';
import { Add as AddIcon } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';
import Config from '../config';
import UserHeader from './UserHeader';
import ReactTimeAgo from 'react-time-ago'

// Displays all questions
const HomePage = () => {
  const initialState = {
    posts: [],
    errorMessage: null,
    isFetching: true,
  }

  const [data, setData] = useState(initialState);
  const { state: authState } = useContext(AuthContext);
  let navigate = useNavigate();

  // Fetch all questions
  useEffect(() => {
    let isMounted = true;

    fetch(`${Config.apiUrl}/api/posts/all`)
      .then(res => res.json())
      .then(data => {
        if (isMounted) {
          setData({ ...data, isFetching: false, posts: data.posts });
        }
      })
      .catch(err => setData({
        ...data, isFetching: false,
        errorMessage: 'Could not fetch questions. Please try again.'
      }));

    return () => {
      isMounted = false;
    }
  }, []);

  const openQuestion = (post) => {
    navigate(`/q/${post._id}`);
  }

  const askQuestion = () => {
    navigate('/askQuestion');
  }

  return <>
    <Stack direction={{ xs: 'column', sm: 'row' }} alignItems={{ xs: 'flex-start', sm: 'center' }}>
      <Typography gutterBottom component="div" variant="h3" sx={{ mt: 2, mb: 3 }}>
        All Questions
      </Typography>
      {
        authState.isAuthenticated &&
        <Fab variant="extended" color="secondary" sx={{ ml: { xs: 0, sm: 5 }, mb: { xs: 3, sm: 0 } }} onClick={askQuestion}>
          <AddIcon sx={{ mr: 1 }} />
          ask question
        </Fab>
      }
    </Stack>

    {/* Display error if posts could not be fetched */}
    {data.errorMessage &&
      <Alert severity="error" sx={{ mt: 1 }}>{data.errorMessage}</Alert>
    }

    {/* No posts available */}
    {
      !data.isFetching && data.posts.length === 0 && !data.errorMessage &&
      <Alert severity="info" sx={{ mt: 1 }}>No questions available.</Alert>
    }

    {/* Display loading status */}
    {
      data.isFetching &&
      <Alert severity="info" sx={{ mt: 1 }}>Loading questions...</Alert>
    }

    {/* Display questions */}
    {
      data.posts.length > 0 &&
      <Paper elevation={3} sx={{ mb: 8 }}>
        <List>
          {
            data.posts.length > 0 &&
            data.posts.map((post, index) =>
              <div key={index}>
                <Grid container spacing={2} sx={{ py: 1, px: 2, cursor: 'pointer' }} onClick={() => openQuestion(post)}>
                  <Grid item xs alignItems="center">
                    <Stack>
                      <Stack direction="row">
                        {/* Stop propagation to allow user to click on user's profile also */}
                        <Box onClick={(e) => e.stopPropagation()}>
                          <UserHeader user={post.user} color={'text.secondary'} />
                        </Box>
                        <Stack></Stack>
                      </Stack>
                      <Typography
                        sx={{ cursor: 'pointer' }}
                        variant="subtitle1"
                        component="div"
                      >
                        {post.title}
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid item xs="auto">
                    <Stack alignItems="flex-end">
                      <Box>
                        <Typography variant="subtitle1" component="div" display="inline" color="secondary">
                          {post.score}
                        </Typography>
                        <Typography variant="subtitle1" component="div" display="inline" sx={{ ml: 0.5 }} color="text.secondary">
                          votes
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" component="div" display="inline" color="secondary">
                          {post.comments.length}
                        </Typography>
                        <Typography variant="subtitle1" component="div" display="inline" sx={{ ml: 0.5 }} color="text.secondary">
                          answers
                        </Typography>
                      </Box>
                      <Box>
                        <Typography variant="subtitle1" component="div" sx={{ ml: 0.5 }} color="text.secondary" display="inline">
                          asked
                          <Box sx={{ color: 'secondary.main', display: 'inline-block' }}>
                            <ReactTimeAgo style={{ marginLeft: '0.3em' }} date={new Date(post.createdAt)} locale="en-US" />
                          </Box>
                        </Typography>
                      </Box>
                    </Stack>
                  </Grid>
                </Grid>
                {
                  // Add divider for all posts except the last one
                  index !== data.posts.length - 1 &&
                  <Divider />
                }
              </div>
            )
          }
        </List>
      </Paper>
    }
  </>
}

export default HomePage;
