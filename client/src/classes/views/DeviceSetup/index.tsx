import React, { useRef, useState } from "react";
import {
  useAudioOutputs,
  useLocalAudioInputActivityPreview,
} from "amazon-chime-sdk-component-library-react";

import JoinMeetingDetails from "../../components/MeetingJoinDetails";
import {
  Container,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Paper,
  Theme,
} from "@material-ui/core";
import VideoSetup from "./VideoSetup";
import AudioSetup from "./AudioSetup";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
    },
    paperHeading: {
      textAlign: "center",
    },
    videoPreview: {
      "& video": {
        height: "150px !important",
        width: "auto !important",
      },
    },

  })
);

function DeviceSetup() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Paper
        className={classes.paper}
        elevation={0}
        variant="outlined"
        square
      >
        <Grid container spacing={3} direction="row">

          <Grid item xs={12} md={6} style={{ padding: "2rem"}}>
            <AudioSetup />
          </Grid>

          <Grid item xs={12} md={6} style={{ padding: "2rem"}}>
            <VideoSetup />
          </Grid>

        </Grid>

        <Grid item xs={12} style={{ padding: "2rem", width: "100% !important"}}>
          <JoinMeetingDetails />
        </Grid>

      </Paper>

    </Container >
  );
}

export default DeviceSetup;
