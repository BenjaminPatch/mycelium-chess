import React from 'react';
import api from '../api';
import { useSnackbar } from 'notistack';
import { DateTimePicker } from '@material-ui/pickers';
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
  course: Course;
  mutate?: any;
}

interface Course {
  _id: string,
  code: string;
  name: string;
};

function CreateAssessment(props: Props) {
  const [open, setOpen] = React.useState(false);
  const { enqueueSnackbar } = useSnackbar();

  const initialPayload = {
    due: new Date(),
    title: '',
    desc: '',
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
    await api.insertAssessment(props.course._id, payload).then((res: any) => {
      handleClose();
      enqueueSnackbar('Assessment item created successfully!', { variant: 'success' });
      setPayload(initialPayload);
      if (props.mutate) {
        props.mutate();
      }
    });
  };

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        onClick={handleOpen}
        endIcon={<AddIcon />}
      >
        New
      </Button>
      <Dialog open={open} onClose={handleClose} aria-labelledby="form-dialog-title">
        <DialogTitle id="form-dialog-title">Create Assessment Item</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Schedule an assessment item with a given due date for {props.course.code}.
          </DialogContentText>
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
          <Button onClick={handleSubmit} color="default">
            Create
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default CreateAssessment;


