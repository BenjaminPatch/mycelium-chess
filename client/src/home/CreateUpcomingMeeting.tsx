import React from 'react';
import api from '../api';
import { mutate } from 'swr';
import { authStore } from "../App";
import { useStore } from "effector-react";
import { useSnackbar } from 'notistack';
import { DateTimePicker } from '@material-ui/pickers';

import {
  Grid,
  Box,
  Button,
  TextField,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  FormControl,
  FormControlLabel,
  InputLabel,
  Checkbox,
  Select,
  MenuItem,
  FormHelperText,
} from '@material-ui/core';

import AddIcon from '@material-ui/icons/Add';

interface Props {
  type: string; // type of meeting to create, e.g. class or consult
  courseId: string;
}

function CreateUpcomingMeeting(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const auth = useStore(authStore);

  const repeatFrequencies = ['Weekly', 'Daily', 'Fortnightly'];

  const initialPayload = {
    name: '',
    time: new Date(),
    duration: 60,
    type: props.type,
    owner: auth.firstname + " " + auth.lastname,
    isRepeat: false,
    repeatFrequency: repeatFrequencies[0],
    numMeetings: 1,
  }

  const [payload, setPayload] = React.useState(initialPayload);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClickClose = () => {
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

  const handleChangeInputIsRepeat = async (event: any) => {
    let newState = { ...payload };
    newState.isRepeat = event.target.checked;
    setPayload(newState);
  };

  const handleChangeInputRepeatFrequency = async (event: any) => {
    let newState = { ...payload };
    newState.repeatFrequency = event.target.value;
    setPayload(newState);
  };

  const handleChangeInputNumMeetings = async (event: any) => {
    let newState = { ...payload };
    newState.numMeetings = event.target.value;
    setPayload(newState);
  };

  const handleSubmit = async () => {
    await api.insertMeeting(props.courseId, payload).then((res: any) => {
      handleClickClose();
      enqueueSnackbar(`New ${props.type} created successfully!`, { variant: 'success' });
      setPayload(initialPayload);
      mutate(`/api/courses/${props.courseId}/meetings`);
    });
  };

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        onClick={handleClickOpen}
        endIcon={<AddIcon />}
      >
        New
      </Button>
      <Dialog
        open={open}
        onClose={handleClickClose}
        fullWidth
        maxWidth="xs"
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create {props.type}</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Schedule a new {props.type}
          </DialogContentText>
          <Box>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
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
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={payload.isRepeat}
                  onChange={handleChangeInputIsRepeat}
                  name="isRepeat"
                />
              }
              label="Recurring meeting"
            />
          </Box>
          {payload.isRepeat &&
          <Grid container spacing={3}>
            <Grid item xs={6}>
              <FormControl color="secondary" style={{ width: '100%' }}>
                <InputLabel id="repeat-frequency-select-helper-label">Repeat frequency</InputLabel>
                <Select
                  labelId="repeat-frequency-select-helper-label"
                  id="repeat-frequency-select-helper"
                  value={payload.repeatFrequency}
                  onChange={handleChangeInputRepeatFrequency}
                  fullWidth
                >
                  {repeatFrequencies.map((freqLabel: string) => (
                  <MenuItem value={freqLabel}>{freqLabel}</MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <TextField
                fullWidth
                margin="dense"
                label="Total number of meetings"
                type="number"
                value={payload.numMeetings}
                onChange={handleChangeInputNumMeetings}
                color="secondary"
              />
            </Grid>
          </Grid>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickClose} color="default">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="default">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateUpcomingMeeting;


