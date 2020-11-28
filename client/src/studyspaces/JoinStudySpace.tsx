import React from "react";

import api from '../api';

import { useSnackbar } from "notistack";

import {
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import {
  GroupAdd,
} from "@material-ui/icons";

interface Props {
  mutate?: any;
}

function JoinStudySpace(props: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);
  const [inviteCode, setInviteCode] = React.useState("");

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInviteCode = (event: any) => {
    setInviteCode(event.target.value);
  };

  const handleJoin = async () => {
    await api.joinStudySpace(inviteCode).then((res: any) => {
      handleClose();
      enqueueSnackbar('Study space joined', { variant: 'success' });
      setInviteCode("");
      if (props.mutate) {
        props.mutate();
      }
    }).catch((err: any) => {
      if (err.response) {
        enqueueSnackbar(err.response.data.message, { variant: 'error' });
      }
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        startIcon={<GroupAdd />}
        onClick={handleOpen}
      >
        Join
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="join-study-space"
      >
        <DialogTitle id="join-study-space">Join Study Space</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Join a study space by entering an invite code.
          </DialogContentText>
          <TextField
            autoFocus
            fullWidth
            id="name"
            label="Study Space Code"
            type="text"
            color="secondary"
            value={inviteCode}
            onChange={handleChangeInviteCode}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleJoin} variant="outlined">
            Join
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default JoinStudySpace;
