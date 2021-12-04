import { useContext, useState } from 'react';
import { AuthContext } from '../reducers/auth';
import MDEditor from '@uiw/react-md-editor';
import Config from '../config';
import { Button, TextField, Typography, Box } from '@mui/material';

const CreatePost = () => {
  const { state: authState } = useContext(AuthContext);
  const [body, setBody] = useState('');
  const [title, setTitle] = useState('');

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
  };

  return (
    <>
      <Typography gutterBottom component="div" variant="h3" sx={{ mt: 2, mb: 3 }}>
        New post
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
          placeholder: 'Post content ....'
        }}
        value={body}
        onChange={setBody}
      />

      {
        authState.isAuthenticated
        && (
          <Box sx={{ mt: 3 }}>
            <Button variant="outlined" onClick={newPost}>Create post</Button>
          </Box>
        )
      }
    </>
  )
}

export default CreatePost;
