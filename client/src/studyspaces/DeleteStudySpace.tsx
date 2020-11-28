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
  DeleteOutlined,
} from "@material-ui/icons";

interface Props {
  studySpace: StudySpace;
  mutate?: any;
}

function DeleteStudySpace(props: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await api.deleteStudySpace(props.studySpace._id).then((res: any) => {
      handleClose();
      enqueueSnackbar('Study space deleted', { variant: 'success' });
      if (props.mutate) {
        props.mutate();
      }
    });
  };

  return (
    <Grid item>
      <Tooltip title="Delete" arrow>
        <IconButton size="small" onClick={handleOpen}>
          <DeleteOutlined />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="delete-study-space"
      >
        <DialogTitle id="delete-study-space">Delete Study Space</DialogTitle>
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
    </Grid>
  );
}

export default DeleteStudySpace;

