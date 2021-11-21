import { Alert, List, ListItem, ListItemText } from '@mui/material';
import { useEffect, useState } from 'react';

const HomePage = () => {
    const initialState = {
        posts: [],
        errorMessage: null,
        isFetching: true,
    }

    const [data, setData] = useState(initialState);

    useEffect(() => {
        let isMounted = true;

        fetch('http://localhost:5000/api/posts/all')
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

    return <>
        {data.errorMessage &&
            <Alert severity="error" sx={{ mt: 1 }}>{data.errorMessage}</Alert>
        }

        <List>
            {
                data.posts.length > 0 &&
                data.posts.map((post, index) =>
                    <ListItem key={index}>
                        <ListItemText primary={post.title} secondary={post.body}></ListItemText>
                    </ListItem>
                )
            }

            {
                !data.isFetching && data.posts.length === 0 && !data.errorMessage &&
                <Alert severity="info" sx={{ mt: 1 }}>No posts available.</Alert>
            }

            {
                data.isFetching &&
                <Alert severity="info" sx={{ mt: 1 }}>Loading posts...</Alert>
            }

        </List>
    </>
}

export default HomePage;
