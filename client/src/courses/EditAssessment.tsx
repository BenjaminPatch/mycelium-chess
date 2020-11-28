import React from 'react';

import api from '../api';
import { Course, Assessment } from "../model";

import { useSnackbar } from 'notistack';
import { DateTimePicker } from '@material-ui/pickers';

import {
  Box,
  Button,
  TextField,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from '@material-ui/core';

import {
  CreateOutlined,
} from '@material-ui/icons';


interface Props {
  course: Course;
  assessment: Assessment;
  mutate?: any;
}

function EditAssessment(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const initialPayload: Assessment = {
    _id: props.assessment._id,
    title: props.assessment.title,
    desc: props.assessment.desc,
    due: props.assessment.due,
  }

  const [payload, setPayload] = React.useState(initialPayload);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInputTitle = async (event: any) => {
    let newState = { ...payload };
    newState.title = event.target.value;
    setPayload(newState);
  };

  const handleChangeInputDesc = async (event: any) => {
    let newState = { ...payload };
    newState.desc = event.target.value;
    setPayload(newState);
  };

  const handleChangeInputDue = async (newDue: any) => {
    let newState = { ...payload };
    newState.due = newDue;
    setPayload(newState);
  };

  const handleSubmit = async () => {
    await api.updateAssessment(props.course._id, props.assessment._id, payload).then((res: any) => {
      handleClose();
      enqueueSnackbar('Assessment edited successfully!', { variant: 'success' });
      setPayload(initialPayload);
      if (props.mutate) {
        props.mutate();
      }
    });
  };

  return (
    <React.Fragment>
      <Tooltip title="Edit" arrow>
        <IconButton size="small" onClick={handleOpen}>
          <CreateOutlined />
        </IconButton>
      </Tooltip>
      <Dialog
        fullWidth={true}
        maxWidth='md'
        open={open}
        onClose={handleClose}
      >
        <DialogTitle>Edit Assessment</DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              id="title"
              label="Assessment Title"
              type="text"
              value={payload.title}
              onChange={handleChangeInputTitle}
              color="secondary"
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              multiline={true}
              rows={4}
              rowsMax={Infinity}
              margin="dense"
              id="contents"
              label="Assessment Description"
              type="text"
              value={payload.desc}
              onChange={handleChangeInputDesc}
              color="secondary"
            />
          </Box>
          <Box>
            <DateTimePicker
              label="Assessment start time"
              value={payload.due}
              onChange={handleChangeInputDue}
              color="secondary"
              disablePast={true}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="default">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </React.Fragment>
  );
}

export default EditAssessment;

