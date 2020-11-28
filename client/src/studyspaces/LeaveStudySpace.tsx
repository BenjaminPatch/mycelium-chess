import React from "react";

import { StudySpace } from "../model";
import api from '../api';

import { useSnackbar } from "notistack";

import {
  Grid,
  Button,
  IconButton,
  Tooltip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import {
  ExitToApp,
} from "@material-ui/icons";

interface Props {
  studySpace: StudySpace;
  mutate?: any;
}

function LeaveStudySpace(props: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleLeave = async () => {
    await api.leaveStudySpace(props.studySpace._id).then((res: any) => {
      handleClose();
      enqueueSnackbar('Left study space', { variant: 'success' });
      if (props.mutate) {
        props.mutate();
      }
    });
  };

  return (
    <Grid item>
      <Tooltip title="Leave" arrow>
        <IconButton size="small" onClick={handleOpen}>
          <ExitToApp />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="leave-study-space"
      >
        <DialogTitle id="leave-study-space">Leave Study Space</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure? You will not be able to re-join without being invited or entering the study space invite code.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleLeave}>
            Leave
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default LeaveStudySpace;

