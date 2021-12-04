import { useEffect, useState, useContext, Fragment } from 'react';
import { Alert, List, ListItem, ListItemText, Box, Fab, Paper, Divider, Typography } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../reducers/auth';
import Config from '../config';

const HomePage = () => {
    const initialState = {
        posts: [],
        errorMessage: null,
        isFetching: true,
    }

    const [data, setData] = useState(initialState);
    const { state: authState } = useContext(AuthContext);
    let navigate = useNavigate();

    // Fetch all posts
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
                errorMessage: 'Could not fetch posts. Please try again.'
            }));

        return () => {
            isMounted = false;
        }
    }, []);

    const openPost = (post) => {
        navigate(`/post/${post._id}`);
    }

    const createPost = () => {
        navigate('/createPost');
    }

    return <>
        <Box sx={{
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center'
        }}>
            <Typography gutterBottom component="div" variant="h3" sx={{ mt: 2, mb: 3 }}>
                Posts
            </Typography>
            {
                authState.isAuthenticated &&
                <Fab variant="extended" color="secondary" sx={{ ml: 5 }} onClick={createPost}>
                    <AddIcon sx={{ mr: 1 }} />
                    New post
                </Fab>
            }
        </Box>

        {/* Display error if posts could not be fetched */}
        {data.errorMessage &&
            <Alert severity="error" sx={{ mt: 1 }}>{data.errorMessage}</Alert>
        }

        {/* No posts available */}
        {
            !data.isFetching && data.posts.length === 0 && !data.errorMessage &&
            <Alert severity="info" sx={{ mt: 1 }}>No posts available.</Alert>
        }

        {/* Display loading status */}
        {
            data.isFetching &&
            <Alert severity="info" sx={{ mt: 1 }}>Loading posts...</Alert>
        }

        {/* Display posts */}
        {
            data.posts.length > 0 &&
            <Paper variant="outlined">
                <List>
                    {
                        data.posts.length > 0 &&
                        data.posts.map((post, index) =>
                            <Fragment key={index}>
                                <ListItem onClick={() => openPost(post)} sx={{ cursor: 'pointer' }}>
                                    <ListItemText primary={post.title} secondary={post.body}></ListItemText>
                                </ListItem>
                                {
                                    index !== data.posts.length - 1 &&
                                    <Divider />
                                }
                            </Fragment>
                        )
                    }
                </List>
            </Paper>
        }
    </>
}

export default HomePage;
