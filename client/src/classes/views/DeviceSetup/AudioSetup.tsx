import React, { useRef, useState } from "react";
import {
  Button,
  createStyles,
  Divider,
  Grid,
  makeStyles,
  Theme,
  Typography,
} from "@material-ui/core";
import DeviceInput from "../../components/DeviceInput";
import styled from "styled-components";

import {
  DefaultAudioMixController,
  TimeoutScheduler,
} from "amazon-chime-sdk-js";
import {
  useAudioInputs,
  useAudioOutputs,
  useLocalAudioInputActivityPreview,
  useMeetingManager,
} from "amazon-chime-sdk-component-library-react";

class TestSound {
  constructor(
    sinkId: string | null,
    frequency = 440,
    durationSec = 1,
    rampSec = 0.1,
    maxGainValue = 0.1
  ) {
    // @ts-ignore
    const audioContext: AudioContext = new (window.AudioContext)();
    const gainNode = audioContext.createGain();
    gainNode.gain.value = 0;
    const oscillatorNode = audioContext.createOscillator();
    oscillatorNode.frequency.value = frequency;
    oscillatorNode.connect(gainNode);
    const destinationStream = audioContext.createMediaStreamDestination();
    gainNode.connect(destinationStream);
    const { currentTime } = audioContext;
    const startTime = currentTime + 0.1;
    gainNode.gain.linearRampToValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(maxGainValue, startTime + rampSec);
    gainNode.gain.linearRampToValueAtTime(
      maxGainValue,
      startTime + rampSec + durationSec
    );
    gainNode.gain.linearRampToValueAtTime(
      0,
      startTime + rampSec * 2 + durationSec
    );
    oscillatorNode.start();
    const audioMixController = new DefaultAudioMixController();
    // @ts-ignore
    audioMixController.bindAudioDevice({ deviceId: sinkId });
    audioMixController.bindAudioElement(new Audio());
    audioMixController.bindAudioStream(destinationStream.stream);
    new TimeoutScheduler((rampSec * 2 + durationSec + 1) * 1000).start(() => {
      audioContext.close();
    });
  }
}

//@TODO refactor: make button info, onclick, text and always button a seperate ButtonInfo interface
interface Props {}

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
  })
);

export const SpeakerSelection: React.FC<Props> = () => {
  const meetingManager = useMeetingManager();
  const { devices, selectedDevice } = useAudioOutputs();
  const { selectedDevice: selectedSpeakerDevice } = useAudioOutputs();
  const [selectedSpeakerOutput, setSelectedSpeakerOutput] = useState(
    selectedSpeakerDevice
  );

  const handleChangeSpeaker = (deviceId: string): void => {
    setSelectedSpeakerOutput(deviceId);
  };

  async function selectAudioOutput(deviceId: string) {
    meetingManager.selectAudioOutputDevice(deviceId);
    handleChangeSpeaker(deviceId);
  }

  const handleTestSpeaker = () => {
    new TestSound(selectedSpeakerOutput);
  };

  return (
    <Grid item style={{ display: "block", marginBottom: "0.5rem" }}>
      <Grid item style={{ display: "block" }}>
        <Typography
          variant="body1"
          style={{ display: "block", marginTop: "1rem" }}
        >
          Speaker Source
        </Typography>
      </Grid>

      <Grid item style={{ display: "block" }}>
        <DeviceInput
          label={"Speaker Source"}
          devices={devices}
          onChange={selectAudioOutput}
          selectedDeviceId={selectedDevice}
          notFoundMsg={"No speaker devices found"}
        />
      </Grid>

      <Grid
        item
        style={{ display: "block", marginTop: "0.5rem", float: "left" }}
      >
        <Button
          variant="contained"
          color="secondary"
          onClick={handleTestSpeaker}
        >
          Test Speakers
        </Button>
      </Grid>
    </Grid>
  );
};

export const MicrophoneSelection: React.FC<Props> = () => {
  const meetingManager = useMeetingManager();
  const { devices, selectedDevice } = useAudioInputs();

  async function selectAudioInput(deviceId: string) {
    meetingManager.selectAudioInputDevice(deviceId);
  }

  return (
    <Grid item style={{ display: "block" }}>
      <Typography variant="body1" style={{ display: "block" }}>
        Microphone Source
      </Typography>

      <DeviceInput
        label={"Microphone source"}
        onChange={selectAudioInput}
        devices={devices}
        selectedDeviceId={selectedDevice}
        notFoundMsg={"No microphone devices found"}
      />
    </Grid>
  );
};

const Track = styled.div`
  width: 100%;
  height: 0.625rem;
  background-color: #ecf0f1;
  border-radius: 0.25rem;
`;

const Progress = styled.div`
  height: 0.625rem;
  background-color: #18bc9c;
  border-radius: 0.25rem;
  transform: scaleX(0);
  transform-origin: left;
  transition: transform 33ms ease-in-out;
  will-change: transform;
`;

const ActivityBar = React.forwardRef((props, ref: any) => (
  <Track>
    <Progress ref={ref} />
  </Track>
));

export const MicrophoneActivity: React.FC<Props> = ({}) => {
  const activityBarRef = useRef<HTMLDivElement>();
  useLocalAudioInputActivityPreview(activityBarRef);

  return (
    <Grid item style={{ display: "block", marginBottom: "0.5rem" }}>
      <Typography
        variant="body1"
        style={{
          display: "block",
          marginTop: "0.5rem",
          marginBottom: "0.5rem",
        }}
      >
        Microphone Activity
      </Typography>

      <ActivityBar ref={activityBarRef} />
    </Grid>
  );
};

function AudioSetup(props: Props) {
  const classes = useStyles();

  return (
    <Grid item xs={12} md={12}>
      <Grid container direction="column" spacing={3}>
        <Grid item>
          <Typography variant="h6">Audio</Typography>
        </Grid>

        <MicrophoneSelection />

        <MicrophoneActivity />

        <Divider />

        <SpeakerSelection />
      </Grid>
    </Grid>
  );
}

export default AudioSetup;
