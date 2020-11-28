import React from "react";
import InfoOutlinedIcon from '@material-ui/icons/InfoOutlined';
import Button from '@material-ui/core/Button';

import { Course, Assessment } from "../model";

import moment from "moment";

import {
  Typography,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@material-ui/core";

interface Props {
  course: Course;
  assessment: Assessment;
}

function AssessmentView(props: Props) {
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Button
        color="secondary"
        variant="contained"
        onClick={handleOpen}
        endIcon={<InfoOutlinedIcon />}
      >
        View
      </Button>
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth='sm'
        fullWidth
        aria-labelledby="view-assessment"
      >
        <DialogTitle id="view-assessment">
          {props.course.code + ': ' + props.assessment.title}
          <Typography variant="body2" color="textSecondary">
            Due {moment(props.assessment.due).format("dddd, MMMM Do YYYY, h:mm:ss a")}
          </Typography>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body1" style={{whiteSpace: 'pre-wrap'}}>
            {props.assessment.desc}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default AssessmentView;

