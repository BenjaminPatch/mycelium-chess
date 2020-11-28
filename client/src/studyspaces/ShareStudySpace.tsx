import React from "react";

import { StudySpace } from "../model";

import {
  createStyles,
  makeStyles,
  Theme
} from "@material-ui/core/styles";

import {
  Grid,
  Button,
  Typography,
  Tooltip,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@material-ui/core";

import {
  ShareOutlined,
} from "@material-ui/icons";

interface Props {
  studySpace: StudySpace;
}

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    inviteCode: {
      textAlign: "center",
      border: "2px dashed black",
      padding: theme.spacing(1, 1),
      borderColor: theme.palette.secondary.main,
      borderRadius: 10,
    },
  })
);

function ShareStudySpace(props: Props) {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Grid item>
      <Tooltip title="Share" arrow>
        <IconButton size="small" onClick={handleOpen}>
          <ShareOutlined />
        </IconButton>
      </Tooltip>
      <Dialog
        open={open}
        onClose={handleClose}
        aria-labelledby="share-study-space"
      >
        <DialogTitle id="share-study-space">Share Study Space</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Invite other users by sending them the following invite code:
          </DialogContentText>
          <Typography variant="h5" className={classes.inviteCode}>
            {props.studySpace._id}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </Grid>
  );
}

export default ShareStudySpace;
