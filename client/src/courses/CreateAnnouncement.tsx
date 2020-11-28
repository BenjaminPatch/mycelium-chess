import React from 'react';
import api from '../api';
import { authStore } from "../App";
import { useStore } from "effector-react";
import { useSnackbar } from 'notistack';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import AddIcon from '@material-ui/icons/Add';

interface Props {
  courseId: string;
  courseCode: string;
  courseName: string;
  mutate: any;
}


function CreateAnnouncement(props: Props) {
  const [openAnnouncement, setOpenAnnouncement] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const auth = useStore(authStore);

  const initialPayload = {
    title: '',
    contents: '',
    author: {
      username: auth.username,
      fullname: auth.name,
      email: auth.email,
    },
  }

  const [payload, setPayload] = React.useState(initialPayload);

  const handleClickOpenAnnouncement = () => {
    setOpenAnnouncement(true);
  };

  const handleCloseAnnouncement = () => {
    setOpenAnnouncement(false);
  };

  const handleChangeInputTitle = async (event: any) => {
    let newState = { ...payload };
    newState.title = event.target.value;
    setPayload(newState);
  };

  const handleChangeInputContents = async (event: any) => {
    let newState = { ...payload };
    newState.contents = event.target.value;
    setPayload(newState);
  };

  const handleSubmit = async () => {
    await api.insertAnnouncement(props.courseId, payload).then((res: any) => {
      handleCloseAnnouncement();
      enqueueSnackbar('Announcement created successfully!', { variant: 'success' });
      setPayload(initialPayload);
      props.mutate();
    });
  };

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        onClick={handleClickOpenAnnouncement}
        endIcon={<AddIcon />}
      >
        New
      </Button>
      <Dialog
        open={openAnnouncement}
        onClose={handleCloseAnnouncement}
        aria-labelledby="form-dialog-title"
        fullWidth={true}
        maxWidth='md'
      >
        <DialogTitle id="form-dialog-title">Create Announcement</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Post an immediate announcement for {props.courseCode}
          </DialogContentText>
          <Box>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              id="title"
              label="Announcement Title"
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
              rows={8}
              rowsMax={Infinity}
              margin="dense"
              id="contents"
              label="Announcement Text"
              type="text"
              value={payload.contents}
              onChange={handleChangeInputContents}
              color="secondary"
            />
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAnnouncement} color="default">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateAnnouncement;

