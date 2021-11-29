import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Alert from '@mui/material/Alert';
import Avatar from '@mui/material/Avatar';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Config from '../config';
import ReactTimeAgo from 'react-time-ago'
import { useTheme } from '@mui/system';

const PostDetail = () => {
  let [post, setPost] = useState(null);
  let [error, setError] = useState('');
  let params = useParams();

  function stringToColor(string) {
    let hash = 0;
    let i;

    /* eslint-disable no-bitwise */
    for (i = 0; i < string.length; i += 1) {
      hash = string.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    for (i = 0; i < 3; i += 1) {
      const value = (hash >> (i * 8)) & 0xff;
      color += `00${value.toString(16)}`.substr(-2);
    }
    /* eslint-enable no-bitwise */

    return color;
  }

  function stringAvatar(name) {
    return {
      sx: {
        bgcolor: stringToColor(name),
      },
      children: `${name.split(' ')[0][0]}`,
    };
  }

  useEffect(() => {
    let isMounted = true;

    fetch(`${Config.apiUrl}/api/posts/${params.postId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isMounted) {
            console.log(data.post);
            setPost(data.post);
          }
        } else {
          setError('Could not fetch post.');
        }
      })
      .catch(err => setError('Could not fetch post.'));

    return () => {
      isMounted = false;
    }
  }, []);

  const theme = useTheme();

  return (
    <>
      {error && (
        <Alert severity="error" sx={{ mt: 1 }}>{error}</Alert>
      )}

      {
        post && (
          <Box
            sx={{
              marginTop: 8,
              display: 'flex',
              flexDirection: 'column',
            }}
          >

            <h1>{post.title}</h1>
            <Box>
              <span style={{ marginRight: '1em' }}>Posted<ReactTimeAgo style={{ marginLeft: '.5em', color: theme.palette.secondary.main }} date={post.createdAt} locale="en-US" /></span>
              {
                post.editedAt && 
                post.createdAt !== post.editedAt &&
                (
                  <span style={{ marginRight: '1em' }}>Edited<ReactTimeAgo style={{ marginLeft: '.5em', color: theme.palette.secondary.main }} date={post.editedAt} locale="en-US" /></span>)
              }
            </Box>

            <Paper variant="outlined" sx={{ width: '100%', padding: 3, mt: 2 }}>
              <Avatar {...stringAvatar(post.user.displayName || 'Unknown')} />
              <h6>{post.user && post.user.displayName}</h6>

              <h2>{post.body}</h2>

              {
                post.comments &&
                post.comments.map((comment, index) => {
                  return <h5>{comment.body}</h5>
                })
              }
            </Paper>
          </Box>

        )
      }
    </>
  )
}

export default PostDetail;
