import React from "react";

import api from '../api';

import { useSnackbar } from "notistack";

import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

interface Props {
  courseId: string;
  announcementId: string;
  mutate?: any;
}

function DeleteAnnouncement(props: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await api.deleteAnnouncement(props.courseId, props.announcementId).then((res: any) => {
      handleClose();
      enqueueSnackbar('Announcement deleted', { variant: 'success' });
      if (props.mutate) {
        props.mutate();
      }
    });
  };

  return (
    <div>
      <Button color="secondary" onClick={handleOpen}>Delete</Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-announcement"
      >
        <DialogTitle id="delete-announcement">Delete Announcement</DialogTitle>
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
    </div>
  );
}

export default DeleteAnnouncement;

