import React from "react";

import api from '../api';

import { useSnackbar } from "notistack";

import {
  Button,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import {
  DeleteOutlined
} from "@material-ui/icons";

interface Props {
  courseId: string;
  meetingId: string;
  mutate?: any;
}

function DeleteMeeting(props: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await api.deleteMeeting(props.courseId, props.meetingId).then((res: any) => {
      handleClose();
      enqueueSnackbar('Meeting deleted', { variant: 'success' });
      if (props.mutate) {
        props.mutate();
      }
    });
  };

  return (
    <React.Fragment>
      <Tooltip title="Delete" arrow>
        <IconButton size="small" onClick={handleOpen}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-meeting"
      >
        <DialogTitle id="delete-meeting">Delete Meeting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Are you sure?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default DeleteMeeting;


