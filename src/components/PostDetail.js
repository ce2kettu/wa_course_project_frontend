import { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import Config from '../config';
import ReactTimeAgo from 'react-time-ago'
import { useTheme } from '@mui/system';
import { AuthContext } from '../reducers/auth';
import MDEditor from '@uiw/react-md-editor';
import { useNavigate } from 'react-router-dom';
import UserHeader from './UserHeader';
import VoteContent from './VoteContent';
import { Grid, Button, Typography, Box, Paper, Alert } from '@mui/material';

const PostDetail = () => {
  const { state: authState } = useContext(AuthContext);
  const [post, setPost] = useState(null);
  const [commentValue, setCommentValue] = useState('');
  const [editableValue, setEditableValue] = useState('');
  const [modifyContentId, setModifyContentId] = useState('');
  const [error, setError] = useState('');
  const [requestRefresh, setRequestRefresh] = useState(0);
  let params = useParams();
  let navigate = useNavigate();

  // Fetch post details
  useEffect(() => {
    let isMounted = true;

    fetch(`${Config.apiUrl}/api/posts/${params.questionId}`)
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          if (isMounted) {
            document.title = `${data.post.title} - Heapoverflow`;
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
  }, [requestRefresh]);

  const postComment = () => {
    fetch(`${Config.apiUrl}/api/comments/${post._id}/newComment`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        body: commentValue
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshPost();
        }
      })
      .catch(err => console.log(err));
  };

  const editComment = (comment) => {
    setModifyContentId('');

    fetch(`${Config.apiUrl}/api/comments/${comment._id}/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        body: editableValue
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshPost();
        }
      })
      .catch(err => console.log(err));
  };

  const deleteComment = (comment) => {
    fetch(`${Config.apiUrl}/api/comments/${comment._id}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshPost();
        }
      })
      .catch(err => console.log(err));
  }

  const deletePost = () => {
    fetch(`${Config.apiUrl}/api/posts/${params.questionId}/delete`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          navigate('/', { replace: true })
        }
      })
      .catch(err => console.log(err));
  }

  const editPost = () => {
    setModifyContentId('');

    fetch(`${Config.apiUrl}/api/posts/${params.questionId}/edit`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        title: post.title,
        body: editableValue
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          refreshPost();
        }
      })
      .catch(err => console.log(err));
  }

  const editCommentInline = (comment) => {
    setEditableValue(comment.body);
    setModifyContentId(comment._id);
  }

  const refreshPost = () => {
    setRequestRefresh(requestRefresh + 1);
  }

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
              my: 8,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <Typography variant="h4" gutterBottom component="div">{post.title}</Typography>
            <Box>
              <span style={{ marginRight: '1em' }}>asked<ReactTimeAgo style={{ marginLeft: '.5em', color: theme.palette.secondary.main }} date={new Date(post.createdAt)} locale="en-US" /></span>
              {
                post.updatedAt &&
                post.createdAt !== post.updatedAt &&
                (
                  <span style={{ marginRight: '1em' }}>edited<ReactTimeAgo style={{ marginLeft: '.5em', color: theme.palette.secondary.main }} date={new Date(post.updatedAt)} locale="en-US" /></span>)
              }
              {
                (authState.user?._id === post.user._id || authState.user?.isAdmin)
                && post._id !== modifyContentId &&
                <Button onClick={() => editCommentInline(post)}>Edit</Button>
              }
              {
                authState.user?.isAdmin &&
                <Button onClick={() => deletePost(post)}>Delete</Button>
              }
              {
                post._id === modifyContentId &&
                <Button onClick={() => editPost(post)}>Save changes</Button>
              }
            </Box>

            <Paper variant="outlined" sx={{ width: '100%', padding: 3, mt: 2 }}>
              <UserHeader user={post.user} />

              <Grid
                container
                spacing={2}
                justifyContent="space-between"
              >
                <Grid item xs={10}>
                  {
                    post._id === modifyContentId ?
                      <MDEditor
                        value={editableValue}
                        onChange={setEditableValue}
                      />
                      :
                      <MDEditor.Markdown source={post.body} />
                  }
                </Grid>
                <Grid item xs="auto">
                  <VoteContent type="post" voteCount={post.score} contentId={post._id} onChange={refreshPost} />
                </Grid>
              </Grid>
            </Paper>

            <Typography sx={{ mt: 4 }} variant="h6" gutterBottom component="div">
              Answers
            </Typography>

            {
              post.comments &&
              post.comments.map((comment, index) => {
                return <Paper variant="outlined" sx={{ width: '100%', padding: 3, mt: 2 }} key={index}>
                  <UserHeader user={comment.user} />

                  <Grid
                    container
                    spacing={2}
                    justifyContent="space-between"
                  >
                    <Grid item xs={10}>
                      {
                        comment._id === modifyContentId ?
                          <MDEditor
                            value={editableValue}
                            onChange={setEditableValue}
                          />
                          :
                          <MDEditor.Markdown source={comment.body} />
                      }
                    </Grid>
                    <Grid item xs="auto">
                      <VoteContent type="comment" voteCount={comment.score} contentId={comment._id} onChange={refreshPost} />
                    </Grid>
                  </Grid>


                  <Box sx={{ mt: 3 }}>
                    <span style={{ marginRight: '1em' }}>answered<ReactTimeAgo style={{ marginLeft: '.5em', color: theme.palette.secondary.main }} date={new Date(comment.createdAt)} locale="en-US" /></span>
                    {
                      comment.updatedAt &&
                      comment.createdAt !== comment.updatedAt &&
                      (
                        <span style={{ marginRight: '1em' }}>edited<ReactTimeAgo style={{ marginLeft: '.5em', color: theme.palette.secondary.main }} date={new Date(comment.updatedAt)} locale="en-US" /></span>)
                    }
                    {
                      (authState.user?._id === comment.user._id || authState.user?.isAdmin)
                      && comment._id !== modifyContentId &&
                      <Button onClick={() => editCommentInline(comment)}>Edit</Button>
                    }
                    {
                      authState.user?.isAdmin &&
                      <Button onClick={() => deleteComment(comment)}>Delete</Button>
                    }
                    {
                      comment._id === modifyContentId &&
                      <Button onClick={() => editComment(comment)}>Save changes</Button>
                    }
                  </Box>
                </Paper>
              })
            }

            {
              post.comments && post.comments.length === 0 &&
              <Alert severity="info" sx={{ mt: 1 }}>No answers yet! Be the first one to answer.</Alert>
            }

            {
              authState.isAuthenticated
                ? (
                  <Box sx={{ mt: 3 }}>
                    <Typography sx={{ mt: 4 }} variant="h6" gutterBottom component="div">
                      Your answer
                    </Typography>
                    <MDEditor
                      textareaProps={{
                        placeholder: 'Post content ....'
                      }}
                      value={commentValue}
                      onChange={setCommentValue}
                    />
                    <Box sx={{ mt: 3 }}>
                      <Button variant="outlined" onClick={postComment}>Post reply</Button>
                    </Box>
                  </Box>
                )
                :
                <Alert severity="warning" sx={{ mt: 1 }}>You need to be logged in to answer.</Alert>
            }
          </Box>
        )
      }
    </>
  )
}

export default PostDetail;
