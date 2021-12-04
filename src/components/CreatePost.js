import { useContext, useState } from 'react';
import { AuthContext } from '../reducers/auth';
import { SnackbarContext } from '../SnackbarContext';
import { Button, TextField, Typography, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { createMessage } from '../util';
import MDEditor from '@uiw/react-md-editor';
import Config from '../config';

const CreatePost = () => {
  const { state: authState } = useContext(AuthContext);
  const { snackPack, setSnackPack } = useContext(SnackbarContext);
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');
  let navigate = useNavigate();

  // Send request to server to create new question
  const newPost = () => {
    fetch(`${Config.apiUrl}/api/posts/new`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        title,
        body
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          setSnackPack((prev) => [...prev, createMessage('Question submitted!', 'success')]);
          navigate(`/q/${data.post._id}`);
        } else {
          setSnackPack((prev) => [...prev, createMessage('Could not submit question.', 'error')]);
        }
      })
      .catch(err => setSnackPack((prev) => [...prev, createMessage('Please try again.', 'error')]))
  };

  return (
    <>
      <Typography gutterBottom component="div" variant="h3" sx={{ mt: 2, mb: 3 }}>
        Ask Question
      </Typography>
      <TextField
        margin="normal"
        required
        fullWidth
        id="title"
        label="Title"
        name="title"
        autoFocus
        onChange={(e) => setTitle(e.target.value)}
        sx={{ mb: 4 }}
      />

      <MDEditor
        textareaProps={{
          placeholder: 'Write your question...'
        }}
        value={body}
        onChange={setBody}
      />

      {
        authState.isAuthenticated
        && (
          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={newPost}>Submit</Button>
          </Box>
        )
      }
    </>
  )
}

export default CreatePost;
