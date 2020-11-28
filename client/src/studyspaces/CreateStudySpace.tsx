import React from "react";

import api from '../api';

import { useSnackbar } from "notistack";
import ChipInput from "material-ui-chip-input";
import ColorPicker from 'material-ui-color-picker'

import {
  Button,
  Box,
  TextField,
  FormControlLabel,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

import AddIcon from "@material-ui/icons/Add";

interface Props {
  mutate?: any;
}

const initialPayload = {
  name: "",
  isPublic: false,
  members: [],
  color: "#51247A",
};

function CreateStudySpace(props: Props) {
  const { enqueueSnackbar } = useSnackbar();

  const [open, setOpen] = React.useState(false);
  const [payload, setPayload] = React.useState(initialPayload);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleChangeInputIsPublic = (event: any) => {
    let newPayload = { ...payload };
    newPayload.isPublic = event.target.checked;
    setPayload(newPayload);
  };

  const handleChangeInputName = (event: any) => {
    let newPayload = { ...payload };
    newPayload.name = event.target.value;
    setPayload(newPayload);
  };

  const handleChangeMembers = (newMembers: any) => {
    let newPayload = { ...payload };
    newPayload.members = newMembers;
    setPayload(newPayload);
  };

  const handleChangeColor = (newColor: string) => {
    let newPayload = { ...payload };
    newPayload.color = newColor;
    setPayload(newPayload);
  };

  const handleSubmit = async () => {
    await api.insertStudySpace(payload).then((res: any) => {
      handleClose();
      enqueueSnackbar('Study space created', { variant: 'success' });
      setPayload(initialPayload);
      if (props.mutate) {
        props.mutate();
      }
    });
  };

  return (
    <div>
      <Button
        variant="contained"
        color="secondary"
        startIcon={<AddIcon />}
        onClick={handleOpen}
      >
        Create
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Create New Study Space</DialogTitle>
        <DialogContent>
          <Box style={{ marginBottom: '250px' }}>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              id="name"
              label="Name"
              type="text"
              color="secondary"
              value={payload.name}
              onChange={handleChangeInputName}
            />
            <FormControlLabel
              control={
                <Checkbox
                  checked={payload.isPublic}
                  onChange={handleChangeInputIsPublic}
                  name="isPublic"
                />
              }
              label="Anyone can join"
            />
            <ChipInput
              fullWidth
              label="Members"
              color="secondary"
              InputProps={{ color: "secondary" }}
              helperText="Enter a student number, then press Enter"
              defaultValue={payload.members}
              onChange={handleChangeMembers}
              disabled={payload.isPublic}
            />
            <ColorPicker
              name="color"
              label="Theme Colour"
              defaultValue="Colour"
              value={payload.color}
              onChange={handleChangeColor}
              style={{ marginTop: 20 }}
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateStudySpace;
