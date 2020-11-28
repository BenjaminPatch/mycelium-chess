import React, { useCallback, useEffect, useState } from "react";
import {
  VideoTileGrid,
  UserActivityProvider,
  useMeetingManager,
  useAudioInputs,
  useToggleLocalMute,
  useLocalVideo,
  useVideoInputs,
  useLocalAudioOutput,
  useAudioOutputs,
  useContentShareControls,
  useContentShareState,
  useRosterState,
  useAttendeeStatus,
} from "amazon-chime-sdk-component-library-react";
import ChatIcon from "@material-ui/icons/Chat";
import GroupIcon from "@material-ui/icons/Group";
import { StyledLayout, StyledContent } from "./Styled";
import useMeetingEndRedirect from "../../hooks/useMeetingEndRedirect";
import {
  AppBar,
  Badge,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Container,
  createStyles,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Divider,
  FormControl,
  Grid,
  IconButton,
  Input,
  InputAdornment,
  List,
  ListItem,
  ListItemIcon,
  ListItemSecondaryAction,
  ListItemText,
  makeStyles,
  Menu,
  MenuItem,
  Paper,
  Popover,
  Tab,
  Tabs,
  TextField,
  Theme,
  Tooltip,
  Typography,
  withStyles,
} from "@material-ui/core";
import useMessaging from "../../hooks/useMessaging";
import MicIcon from "@material-ui/icons/Mic";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import VideocamIcon from "@material-ui/icons/Videocam";
import VolumeUpIcon from "@material-ui/icons/VolumeUp";
import DesktopWindowsIcon from "@material-ui/icons/DesktopWindows";
import { DeviceConfig } from "amazon-chime-sdk-component-library-react/lib/types";
import MicOffIcon from "@material-ui/icons/MicOff";
import VideocamOffIcon from "@material-ui/icons/VideocamOff";
import VolumeOffIcon from "@material-ui/icons/VolumeOff";
import DesktopAccessDisabledIcon from "@material-ui/icons/DesktopAccessDisabled";
import "emoji-mart/css/emoji-mart.css";
import { Emoji, Picker } from "emoji-mart";
import { Visibility } from "@material-ui/icons";
import InsertEmoticonOutlinedIcon from "@material-ui/icons/InsertEmoticonOutlined";
import { useStore } from "effector-react";
import { authStore, darkModeStore } from "../../../App";
import { faLessThanEqual } from "@fortawesome/free-solid-svg-icons";
import moment from "moment";
import FileCopyIcon from "@material-ui/icons/FileCopy";
//import { darkModeStore, darkModeApi } from 'App'
import BuildIcon from "@material-ui/icons/Build";
import { Prompt, useHistory } from "react-router-dom";
import VideocamOutlinedIcon from "@material-ui/icons/VideocamOutlined";
import MicOutlinedIcon from "@material-ui/icons/MicOutlined";
import MicOffOutlinedIcon from "@material-ui/icons/MicOffOutlined";
import VideocamOffOutlinedIcon from "@material-ui/icons/VideocamOffOutlined";
import MeetingFiles from "./MeetingFiles";
import { useAppState } from "../../providers/AppStateProvider";
import useSWR from 'swr';
import EngagementPrompt from '../../components/EngagementPrompt';
import EngagementResponse from '../../components/EngagementResponse';
import { useSnackbar } from 'notistack';

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
    root: {
      flexGrow: 1,
      width: "100%",
      backgroundColor: theme.palette.background.paper,
    },
    sidebarBox: {
    	position: 'absolute',
    	top: 0,
    	bottom: 0,
    	left: 0,
    	right: 0,
    	flexDirection: 'column',
    	justifyContent: "space-between",
    }
  })
);

const MicrophoneControl = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { muted, toggleMute } = useToggleLocalMute();
  const meetingManager = useMeetingManager();

  const audioInputConfig: DeviceConfig = {
    additionalDevices: true,
  };
  const { devices, selectedDevice } = useAudioInputs(audioInputConfig);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ButtonGroup variant="text" size="small" orientation="vertical">
      <IconButton onClick={toggleMute}>
        {muted ? <MicOffIcon /> : <MicIcon />}
      </IconButton>

      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
        disableRipple={true}
      >
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        {devices.map((device) => (
          <MenuItem
            key={device.label}
            selected={
              selectedDevice != null && device.deviceId == selectedDevice
            }
            onClick={() => {
              handleClose();
              meetingManager.selectAudioInputDevice(device.deviceId);
            }}
          >
            {device.label}
          </MenuItem>
        ))}
      </Menu>
    </ButtonGroup>
  );
};

export const useSelectVideoInputDevice = () => {
  const { isVideoEnabled, toggleVideo } = useLocalVideo();
  const meetingManager = useMeetingManager();

  const selectVideo = useCallback(
    async (deviceId: string) => {
      if (deviceId === "none" && isVideoEnabled) {
        await toggleVideo();
      }
      await meetingManager.selectVideoInputDevice(deviceId);
    },
    [isVideoEnabled]
  );

  return selectVideo;
};

const VideoControl = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const videoInputConfig: DeviceConfig = {
    additionalDevices: true,
  };
  const { devices, selectedDevice } = useVideoInputs(videoInputConfig);
  const { isVideoEnabled, toggleVideo } = useLocalVideo();
  const selectDevice = useSelectVideoInputDevice();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ButtonGroup variant="text" size="small" orientation="vertical">
      <IconButton onClick={toggleVideo}>
        {isVideoEnabled ? <VideocamIcon /> : <VideocamOffIcon />}
      </IconButton>

      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
        disableRipple={true}
      >
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        {devices.map((device) => (
          <MenuItem
            key={device.label}
            selected={
              selectedDevice != null && device.deviceId == selectedDevice
            }
            onClick={() => {
              handleClose();
              selectDevice(device.deviceId);
            }}
          >
            {device.label}
          </MenuItem>
        ))}
      </Menu>
    </ButtonGroup>
  );
};

const SpeakerControl = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const meetingManager = useMeetingManager();

  const { devices, selectedDevice } = useAudioOutputs();
  const { isAudioOn, toggleAudio } = useLocalAudioOutput();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ButtonGroup variant="text" size="small" orientation="vertical">
      <IconButton onClick={toggleAudio}>
        {isAudioOn ? <VolumeUpIcon /> : <VolumeOffIcon />}
      </IconButton>

      <IconButton
        aria-label="more"
        aria-controls="long-menu"
        aria-haspopup="true"
        onClick={handleClick}
        size="small"
        disableRipple={true}
      >
        <ArrowDropDownIcon />
      </IconButton>
      <Menu
        id="long-menu"
        anchorEl={anchorEl}
        keepMounted
        open={open}
        onClose={handleClose}
        PaperProps={{
          style: {
            maxHeight: 48 * 4.5,
            width: "20ch",
          },
        }}
      >
        {devices.map((device) => (
          <MenuItem
            key={device.label}
            selected={
              selectedDevice != null && device.deviceId == selectedDevice
            }
            onClick={() => {
              handleClose();
              meetingManager.selectAudioOutputDevice(device.deviceId);
            }}
          >
            {device.label}
          </MenuItem>
        ))}
      </Menu>
    </ButtonGroup>
  );
};

const ScreenShareControl = () => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const { isLocalUserSharing } = useContentShareState();
  const {
    paused,
    toggleContentShare,
    togglePauseContentShare,
  } = useContentShareControls();

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ButtonGroup variant="text" size="small" orientation="vertical">
      <IconButton size="small" onClick={toggleContentShare}>
        {isLocalUserSharing ? (
          <DesktopWindowsIcon />
        ) : (
          <DesktopAccessDisabledIcon />
        )}
      </IconButton>
    </ButtonGroup>
  );
};

export const RosterAttendee: React.FC<{ attendeeId: string, dividerEnabled: boolean }> = ({
  attendeeId,
  dividerEnabled,
  ...rest
}) => {
  const { muted, videoEnabled, sharingContent } = useAttendeeStatus(attendeeId);
  const { roster } = useRosterState();
  const attendeeName = roster[attendeeId]?.name || "Unknown Name";

  return (
    <ListItem
      disableGutters={false}
      dense={true}
      style={{
        maxWidth: "100%",
        wordWrap: "break-word",
        hyphens: "auto",
      }}
      divider={dividerEnabled}
    >
      <ListItemText primary={attendeeName || "Unknown Name"} />
      <ListItemSecondaryAction>
        {sharingContent ? <DesktopWindowsIcon /> : <></>}
        {muted ? <MicOffOutlinedIcon /> : <MicOutlinedIcon />}
        {videoEnabled ? <VideocamIcon /> : <VideocamOffOutlinedIcon />}
      </ListItemSecondaryAction>
    </ListItem>
  );
};

const StyledBadge = withStyles((theme: Theme) =>
  createStyles({
    badge: {
      right: -3,
      top: 13,
      border: `2px solid ${theme.palette.background.paper}`,
      padding: "0 4px",
    },
  })
)(Badge);

const MeetingView = () => {
  useMeetingEndRedirect();
  const classes = useStyles();
  const manager = useMeetingManager();
  const { enqueueSnackbar } = useSnackbar();

  const [engagementResponse, sendEngagementResponse, clear] = useMessaging(manager.meetingSession, "ENGAGEMENT_RESPONSE");
  const [engagementRequest, sendEngagementRequest] = useMessaging(manager.meetingSession, "ENGAGEMENT_REQUEST");

  const [messages, sendMessage] = useMessaging(manager.meetingSession, "TOPIC");
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);
  const [textbox, setTextbox] = React.useState("");
  const handleTextboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextbox(event.target.value);
  };

  const { meetingId, isEngagementRequest, isStaff, setIsStaff } = useAppState();
  const history = useHistory();

  const [modalVisible, setModalVisible] = useState(false);
  const [lastLocation, setLastLocation] = useState<Location | null>(null);
  const [confirmedNavigation, setConfirmedNavigation] = useState(false);
  const closeModal = () => {
    setModalVisible(false);
  };
  const handleBlockedNavigation = (nextLocation: any, action: any): boolean => {
    if (!confirmedNavigation) {
      setModalVisible(true);
      setLastLocation(nextLocation);
      return false;
    }
    return true;
  };
  const handleConfirmNavigationClick = () => {
    setModalVisible(false);
    setConfirmedNavigation(true);
  };

  const auth = useStore(authStore);

  useEffect(() => {
    if (confirmedNavigation && lastLocation) {
      // Navigate to the previous blocked location with your navigate function
      history.push(lastLocation.pathname);
    }
    setIsStaff(auth.userType === 'staff');
  }, [confirmedNavigation, lastLocation]);

  const darkMode = useStore(darkModeStore);

  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const noVideoView = () => (
    <Grid
      container
      direction="column"
      style={{ justifyContent: "space-around" }}
    >
      <Typography variant="body2" align="center">
        <CircularProgress size="1em" /> Waiting for others to share video
      </Typography>
    </Grid>
  );

  const [value, setValue] = React.useState(0);

  const [seenMessages, setSeenMessages] = useState(0);

  const [allAttendees, setAllAttendees] = React.useState(new Map());

  useEffect(() => {
    if (value === 0) {
      setSeenMessages(messages.length);
    }
  }, [messages, value]);

  const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
    setValue(newValue);
  };

  const { roster } = useRosterState();
  let rosterArray: any = Object.values(roster);

  for (let i = 0; i < rosterArray.length; i++) {
    if (!allAttendees.get(rosterArray[i].chimeAttendeeId)) {
      // Doesn't exist yet
      setAllAttendees(allAttendees.set(rosterArray[i].chimeAttendeeId, rosterArray[i].name));
    }
  }

  const leaveMeeting = () => {
    manager.leave();
  };

  useEffect(() => {
    return () => {
      leaveMeeting();
    };
  }, []);

  const [numFiles, setNumFiles] = React.useState(0);

  const updateNumFiles = (newNumFiles: number) => {
    setNumFiles(newNumFiles);
  }

  const getName = (attendeeId: string) => {
    const retVal = allAttendees.get(attendeeId);
    return retVal ? retVal : "OnBoard Student";
  };

  const query = `/api/meetings/${meetingId}`;
  const fetcher = (url: any) => fetch(url).then(r => r.json());
  const { data, error, mutate } = useSWR(query, fetcher);
  if (data) {
    console.log(data.data.owner);
  }

  const getID = (name: string) => {
    for (let i = 0; i < rosterArray.length; i++) {
      if (rosterArray[i].name === name) {
        return rosterArray[i].chimeAttendeeId;
      }
    }
    return null;
  }

  const attendeeItems = rosterArray.map((attendee: any, idx: number) => {
    const { chimeAttendeeId } = attendee || {};
    return (
      <RosterAttendee dividerEnabled={idx < rosterArray.length - 1} key={chimeAttendeeId} attendeeId={chimeAttendeeId} />
    );
  });

  return (
    <UserActivityProvider>
      <Prompt when={true} message={handleBlockedNavigation} />
      <Dialog
        open={modalVisible}
        onClose={closeModal}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Leaving Call"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to leave the current call?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={closeModal} color="default">
            Cancel
          </Button>
          <Button
            onClick={() => {
              handleConfirmNavigationClick();
              closeModal();
            }}
            color="default"
            autoFocus
          >
            Yes
          </Button>
        </DialogActions>
      </Dialog>
      {isEngagementRequest && !isStaff &&
      <EngagementPrompt send={sendEngagementResponse} open={true} />
      }
      <Container maxWidth="lg" disableGutters={true}>
        <Grid container spacing={0}>
          <Grid item sm={1}>
            <Grid
              container
              direction="column"
              alignItems="flex-end"
              spacing={2}
              style={{ paddingRight: '1em' }}
            >
              <Grid item>
                <MicrophoneControl />
              </Grid>
              <Grid item>
                <VideoControl />
              </Grid>
              <Grid item>
                <SpeakerControl />
              </Grid>
              <Grid item>
                <ScreenShareControl />
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={8} style={{ height: "80vh" }}>
            <Paper
              className={classes.paper}
              elevation={0}
              variant="outlined"
              square
              style={{ height: "100%" }}
            >
              <VideoTileGrid
                css={"width: 50%"}
                noRemoteVideoView={noVideoView()}
              />
            </Paper>
          </Grid>
          <Grid item md={3}>
            {" "}
            {/* TODO: this makes the tabs fit */}
            <Paper
              className={classes.paper}
              style={{
                height: "80vh",
                padding: 0,
                display: "flex",
                flexDirection: "column",
              }}
              elevation={0}
              variant="outlined"
              square
            >
              <div
              	style={{
              		display: "flex",
              		flexDirection: "column",
              		justifyContent: "space-between",
              		height: "100%",
              	}}
              >
	              <div>
	                <div className={classes.root}>
	                  <Tabs
	                    indicatorColor="secondary"
	                    variant="fullWidth"
	                    value={value}
	                    onChange={handleChange}
	                  >
	                    <Tab
	                      style={{ minWidth: 0 }}
	                      icon={
	                        <StyledBadge
	                          invisible={
	                            value === 0 || seenMessages >= messages.length
	                          }
	                          badgeContent={messages.length - seenMessages}
	                          color="error"
	                        >
	                          <Tooltip title="Chat" placement="top" arrow>
	                            <ChatIcon />
	                          </Tooltip>
	                        </StyledBadge>
	                      }
	                    />
	                    <Tab
	                      style={{ minWidth: 0 }}
	                      icon={
	                        <Tooltip title="Participants" placement="top" arrow>
	                          <StyledBadge
	                            badgeContent={rosterArray.length}
	                            color="secondary"
	                          >
	                            <GroupIcon />
	                          </StyledBadge>
	                        </Tooltip>
	                      }
	                    />

	                    <Tab
	                      style={{ minWidth: 0 }}
	                      icon={
	                        <Tooltip title="Files" placement="top" arrow>
	                          <StyledBadge badgeContent={numFiles} color="secondary">
	                            <FileCopyIcon />
	                          </StyledBadge>
	                        </Tooltip>
	                      }
	                    />

	                    {auth.userType == "staff" ? (
	                      <Tab
	                        style={{ minWidth: 0 }}
	                        icon={
	                          <Tooltip
	                            title="Presenter Tools"
	                            placement="top"
	                            arrow
	                          >
	                            <BuildIcon />
	                          </Tooltip>
	                        }
	                      />
	                    ) : (
	                      <></>
	                    )}
	                  </Tabs>
	                </div>
	              </div>
	              <div style={{ flexGrow: 1, display: 'flex', position: 'relative' }}>
	                <div
	                	className={classes.sidebarBox}
	                	style={{ display: value === 0 ? 'flex' : 'none' }}
	                >
	                  <div
	                    style={{
	                      maxHeight: "90%",
	                      overflow: "auto",
	                      flexDirection: "column-reverse",
	                      display: "flex",
	                    }}
	                  >
	                    <List>
	                      {messages.map((message: any, index: number) => (
	                        <>
	                          <ListItem
	                            key={"message" + index}
	                            divider={index < messages.length - 1}
	                            disableGutters={false}
	                            dense={true}
	                            style={{
	                              maxWidth: "100%",
	                              wordWrap: "break-word",
	                              hyphens: "auto",
	                            }}
	                          >
	                            <ListItemText
	                              style={{
	                                wordWrap: "break-word",
	                                hyphens: "auto",
	                                overflowWrap: "break-word",
	                                wordBreak: "break-all",
	                              }}
	                            >
	                              <Tooltip
	                                title={moment(message.timestampMs).format(
	                                  "hh:mm a"
	                                )}
	                                placement="left"
	                                arrow
	                              >
	                                <b>{getName(message.senderAttendeeId)}: </b>
	                              </Tooltip>
	                              {message.text()}
	                            </ListItemText>
	                          </ListItem>
	                        </>
	                      ))}
	                    </List>
	                  </div>
	                  <div style={{ height: "10%" }}>
	                    <Divider />
	                    <Input
	                      style={{ margin: 8 }}
	                      type="text"
	                      placeholder="Send Message"
	                      fullWidth
	                      margin="dense"
	                      /* InputProps={{ disableUnderline: true }}*/
	                      disableUnderline={true}
	                      value={textbox}
	                      onChange={handleTextboxChange}
	                      onKeyPress={(event) => {
	                        if (event.key === "Enter") {
	                          // ts-ignore because react typings incorrectly infer the `target`
	                          // @ts-ignore
	                          sendMessage(event.target.value);
	                          // @ts-ignore
	                          setTextbox("");
	                        }
	                      }}
	                      endAdornment={
	                        <InputAdornment position="end">
	                          <IconButton
	                            aria-label="more"
	                            aria-controls="long-menu"
	                            aria-haspopup="true"
	                            onClick={handleClick}
	                            style={{ marginRight: "10px" }}
	                          >
	                            <InsertEmoticonOutlinedIcon />
	                          </IconButton>
	                          <Popover
	                            id="long-menu"
	                            anchorEl={anchorEl}
	                            keepMounted
	                            open={open}
	                            onClose={handleClose}
	                            anchorOrigin={{
	                              vertical: "top",
	                              horizontal: "left",
	                            }}
	                            transformOrigin={{
	                              vertical: "center",
	                              horizontal: "center",
	                            }}
	                          >
	                            <Picker
                                set="facebook"
                                title=""
                                emoji="thumbsup"
                                theme={darkMode ? "dark" : "light"}
                                onSelect={(e: any) => {
                                  setTextbox((cur) => cur + e.native);
                                  handleClose();
                                }}
                              />
	                          </Popover>
	                        </InputAdornment>
	                      }
	                    />
	                  </div>
	                </div>

		              <div
	                	className={classes.sidebarBox}
	                	style={{ display: value === 1 ? 'flex' : 'none' }}
	                >
		                <Grid
		                  item
		                  style={{
		                    maxHeight: "90%",
		                    overflow: "auto",
		                    flexDirection: "column-reverse",
		                    display: "flex",
		                  }}
		                >
		                  <List>{attendeeItems}</List>
		                </Grid>
		              </div>
		              <div
	                	className={classes.sidebarBox}
	                	style={{ display: value === 2 ? 'flex' : 'none' }}
	                >
		                <MeetingFiles updateNumFiles={updateNumFiles} />
		              </div>
		              <div
	                	className={classes.sidebarBox}
	                	style={{
                      display: value === 3 ? 'flex' : 'none',
                    }}
	                >
                    <div>
                      <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        padding: '1em 0',
                      }}>
                        {isStaff &&
                        <Button
                          variant="contained"
                          color="default" onClick={() => {
                            sendEngagementRequest("engagement-request");
                            enqueueSnackbar('Sent engagement requests', { variant: 'success' });
                          }}
                        >
                          Gauge Engagement
                        </Button>
                        }
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                        {engagementResponse.length > 0 && isStaff &&
                        <EngagementResponse responses={engagementResponse} clear={clear} />
                        }
                      </div>
                    </div>
		              </div>
	              </div>
              </div>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </UserActivityProvider>
  );
};

export default MeetingView;
