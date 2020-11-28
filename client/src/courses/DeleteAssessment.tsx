import React from "react";

import api from '../api';
import { Assessment } from '../model';

import { useSnackbar } from "notistack";

import {
  Tooltip,
  IconButton,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import {
  DeleteOutlined,
} from '@material-ui/icons';

interface Props {
  courseId: string;
  assessment: Assessment;
  mutate?: any;
}

function DeleteAssessment(props: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleDelete = async () => {
    await api.deleteAssessment(props.courseId, props.assessment._id).then((res: any) => {
      handleClose();
      enqueueSnackbar('Assessment item deleted', { variant: 'success' });
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
        aria-labelledby="delete-assessment"
      >
        <DialogTitle id="delete-assessment">Delete Assessment</DialogTitle>
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

export default DeleteAssessment;

