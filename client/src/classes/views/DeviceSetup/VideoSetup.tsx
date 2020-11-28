import React, { useState } from "react";
import {
  createStyles,
  FormControl,
  Grid,
  makeStyles,
  MenuItem,
  Select,
  Theme,
  Typography,
} from "@material-ui/core";

import {
  PreviewVideo,
  useMeetingManager,
  useSelectVideoQuality,
  useVideoInputs,
  VideoQuality,
} from "amazon-chime-sdk-component-library-react";
import DeviceInput from "../../components/DeviceInput";

//@TODO refactor: make button info, onclick, text and always button a seperate ButtonInfo interface
interface Props {}

export const VIDEO_INPUT_QUALITY = {
  "360p": "360p (nHD) @ 15 fps (600 Kbps max)",
  "540p": "540p (qHD) @ 15 fps (1.4 Mbps max)",
  "720p": "720p (HD) @ 15 fps (1.4 Mbps max)",
};

const qualityOptions = [
  {
    label: "Select video quality",
    value: "unselected",
  },
  {
    label: VIDEO_INPUT_QUALITY["720p"],
    value: "720p",
  },
  {
    label: VIDEO_INPUT_QUALITY["540p"],
    value: "540p",
  },
  {
    label: VIDEO_INPUT_QUALITY["360p"],
    value: "360p",
  },
];

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      fullWidth: true,
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
    formControl: {
      fullWidth: true,
      display: "flex",
      wrap: "nowrap",
    },

    selectEmpty: {
      marginTop: theme.spacing(2),
    },
  })
);

function VideoSetup(props: Props) {
  const classes = useStyles();
  const selectVideoQuality = useSelectVideoQuality();
  const [videoQuality, setVideoQuality] = useState("unselected");

  async function selectQuality(event: any) {
    const quality = event.target.value as VideoQuality;
    setVideoQuality(quality);
    selectVideoQuality(quality);
  }

  const meetingManager = useMeetingManager();
  const { devices, selectedDevice } = useVideoInputs();

  async function selectVideoInput(deviceId: string) {
    meetingManager.selectVideoInputDevice(deviceId);
  }

  return (
    <Grid item xs={12} md={12}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography variant="h6">Video</Typography>
        </Grid>

        <Grid item>
          <Typography variant="body1" style={{ display: "block" }}>
            Camera Source
          </Typography>
          <Grid />

          <Grid item style={{ width: "100%" }}>
            <DeviceInput
              label={"Camera source"}
              onChange={selectVideoInput}
              devices={devices}
              selectedDeviceId={selectedDevice}
              notFoundMsg={"No camera devices found"}
            />
          </Grid>
        </Grid>

        <Grid item>
          <Typography
            variant="body1"
            style={{ display: "block", marginTop: "0.5rem" }}
          >
            Video Quality
          </Typography>
          <Grid />

          <Grid item>
            <FormControl fullWidth={true} variant="outlined">
              <Select
                labelId={"Video quality"}
                id={"Video quality"}
                value={videoQuality}
                onChange={selectQuality}
                displayEmpty
                fullWidth={true}
                className={classes.selectEmpty}
              >
                {qualityOptions.map((option, i) => (
                  <MenuItem value={option.value}>{option.label}</MenuItem>
                ))}
              </Select>
            </FormControl>
          </Grid>
        </Grid>

        <Grid item>
          <Typography variant="body1" style={{ display: "block" }}>
            Video Preview
          </Typography>
        </Grid>

        <Grid item>
          <PreviewVideo className={classes.videoPreview} />
        </Grid>
      </Grid>
    </Grid>
  );
}

export default VideoSetup;
