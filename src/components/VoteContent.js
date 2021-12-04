import { useEffect, useState, useContext } from 'react';
import { KeyboardArrowUp, KeyboardArrowDown } from "@mui/icons-material";
import { IconButton, Stack, Typography, useTheme } from "@mui/material";
import { AuthContext } from '../reducers/auth';
import Config from '../config';

const VoteContent = ({ contentId, voteCount, type, onChange }) => {
  const { state: authState } = useContext(AuthContext);
  const [vote, setVote] = useState({ hasVoted: false });

  // Check if user has already voted
  useEffect(() => {
    let isMounted = true;

    if (authState.isAuthenticated) {
      fetch(`${Config.apiUrl}/api/votes/hasVoted/${contentId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${authState.token}`
        },
        body: JSON.stringify({
          type
        })
      })
        .then(res => res.json())
        .then(data => {
          if (data.success) {
            if (isMounted) {
              setVote({
                hasVoted: data.hasVoted,
                type: data.type,
              });
            }
          }
        });
    }

    return () => {
      isMounted = false;
    }
  }, [authState.isAuthenticated]);

  // Vote on the content
  const doVote = (val) => {
    fetch(`${Config.apiUrl}/api/votes/${type}/${contentId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${authState.token}`
      },
      body: JSON.stringify({
        type: val ? 'up' : 'down'
      })
    })
      .then(res => res.json())
      .then(data => {
        if (data.success) {
          onChange();
          setVote({
            hasVoted: true,
            type: val ? 'up' : 'down'
          });
        }
      })
      .catch(err => console.log(err));
  }

  const isVotingDisabled = (type) => {
    if (!authState.isAuthenticated) {
      return false;
    }

    return vote.hasVoted && vote.type === type;
  }

  const theme = useTheme();

  const getButtonColor = (type) => {
    if (!vote.hasVoted) {
      return 'inherit';
    }

    if (vote.type == type) {
      if (vote.type === 'down') {
        return theme.palette.error.main;
      } else {
        return theme.palette.success.main;
      }
    }

    return 'inherit';
  }

  return (
    <Stack
      spacing={0.5}
      alignItems="center"
    >
      <IconButton aria-label="delete" size="large"
        disabled={isVotingDisabled('up')} onClick={() => doVote(true)}
        sx={{ color: `${getButtonColor('up')}!important` }}>
        <KeyboardArrowUp fontSize="inherit" />
      </IconButton>
      <Typography variant="h5" gutterBottom component="div">
        {voteCount}
      </Typography>
      <IconButton aria-label="delete" size="large"
        disabled={isVotingDisabled('down')} onClick={() => doVote(false)}
        sx={{ color: `${getButtonColor('down')}!important` }}>
        <KeyboardArrowDown fontSize="inherit" />
      </IconButton>
    </Stack>
  )
}

export default VoteContent;
