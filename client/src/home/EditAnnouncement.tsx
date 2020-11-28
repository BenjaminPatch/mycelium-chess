import React from 'react';
import api from '../api';
import { useSnackbar } from 'notistack';
import { useTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';

interface Props {
  courseId: string;
  announcementId: string;
  title: string;
  contents: string;
  mutate?: any;
}

function EditAnnouncement(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();
  const fullScreenDialog = useMediaQuery(useTheme().breakpoints.down('sm'));

  const initialPayload = {
    title: props.title,
    contents: props.contents,
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

  const handleChangeInputContents = async (event: any) => {
    let newState = { ...payload };
    newState.contents = event.target.value;
    setPayload(newState);
  };

  const handleSubmit = async () => {
    await api.updateAnnouncement(props.courseId, props.announcementId, payload).then((res: any) => {
      handleClose();
      enqueueSnackbar('Announcement edited successfully!', { variant: 'success' });
      setPayload(initialPayload);
      if (props.mutate) {
        props.mutate();
      }
    });
  };

  return (
    <div>
      <Button color="secondary" onClick={handleOpen}>Edit</Button>
      <Dialog
        fullScreen={fullScreenDialog}
        fullWidth={true}
        maxWidth='md'
        open={open}
        onClose={handleClose}
        aria-labelledby="form-dialog-title"
      >
        <DialogTitle id="form-dialog-title">Edit Announcement</DialogTitle>
        <DialogContent>
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
          <Button onClick={handleClose} color="default">
            Cancel
          </Button>
          <Button onClick={handleSubmit} color="secondary" variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default EditAnnouncement;


