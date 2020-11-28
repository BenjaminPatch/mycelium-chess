import React from 'react';

import api from '../api';

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
  courseId: string;
  meetingId: string;
  meetingName: string;
  meetingTime: Date;
  meetingDuration: number;
  mutate?: any;
}

function EditMeeting(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const initialPayload = {
    _id: props.meetingId,
    name: props.meetingName,
    time: props.meetingTime,
    duration: props.meetingDuration,
  }

  const [payload, setPayload] = React.useState(initialPayload);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInputName = async (event: any) => {
    let newState = { ...payload };
    newState.name = event.target.value;
    setPayload(newState);
  };

  const handleChangeInputTime = async (newTime: any) => {
    let newState = { ...payload };
    newState.time = newTime;
    setPayload(newState);
  };

  const handleChangeInputDuration = async (event: any) => {
    let newState = { ...payload };
    newState.duration = event.target.value;
    setPayload(newState);
  };

  const handleSubmit = async () => {
    await api.updateMeeting(props.courseId, props.meetingId, payload).then((res: any) => {
      handleClose();
      enqueueSnackbar('Meeting edited successfully!', { variant: 'success' });
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
        <DialogTitle>Edit Meeting</DialogTitle>
        <DialogContent>
          <Box>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              id="title"
              label="Meeting name"
              type="text"
              value={payload.name}
              onChange={handleChangeInputName}
              color="secondary"
            />
          </Box>
          <Box>
            <DateTimePicker
              label="Meeting start time"
              value={payload.time}
              onChange={handleChangeInputTime}
              color="secondary"
              disablePast={true}
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              margin="dense"
              label="Duration in minutes"
              type="number"
              value={payload.duration}
              onChange={handleChangeInputDuration}
              color="secondary"
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

export default EditMeeting;

