import React from 'react';

import {
  getEmotions,
  getEmotionIcon,
} from '../../util';

import { useAppState } from '../providers/AppStateProvider';

import { makeStyles } from '@material-ui/core/styles';

import {
  Grid,
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from '@material-ui/core';

type Props = {
  open: boolean,
  send: (arg0: string) => void
}

const useStyles = makeStyles({
  emotionButton: {
    '& svg': {
      height: '8rem',
      width: '8rem',
    },
  },
});

const responses = getEmotions();

function EngagementPrompt (props: Props) {
  const classes = useStyles();
  const { open, send } = props;
  const { setIsEngagementRequest } = useAppState();

  const handleClose = () => {
    setIsEngagementRequest(false);
  };

  const handleListItemClick = (value: any) => {
    send(value);
    setIsEngagementRequest(false);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth='md'
      aria-labelledby="dialog-title"
    >
      <DialogTitle id="dialog-title" style={{ textAlign: 'center' }}>
        How are you going?
      </DialogTitle>
      <DialogContent>
        <Grid container spacing={3} style={{ padding: '1em' }}>
          {responses.map((response) => (
            <Grid item>
              <IconButton
                onClick={() => handleListItemClick(response.name)}
                className={classes.emotionButton}
              >
                {getEmotionIcon(response.name)}
              </IconButton>
              <Typography variant="body1" align="center">{response.name}</Typography>
            </Grid>
          ))}
        </Grid>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>
          Dismiss
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default EngagementPrompt;