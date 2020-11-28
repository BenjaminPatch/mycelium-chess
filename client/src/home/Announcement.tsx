import React from 'react';
import Truncate from 'react-truncate';
import TimeAgo from 'react-timeago';
import moment from 'moment';
import { authStore } from "../App";
import EditAnnouncement from "./EditAnnouncement";
import DeleteAnnouncement from "./DeleteAnnouncement";
import { useStore } from "effector-react";
import { Link } from 'react-router-dom';
import { useTheme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Dialog, { DialogProps } from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';
import Typography from '@material-ui/core/Typography';
import ListItem from '@material-ui/core/ListItem';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import useMediaQuery from '@material-ui/core/useMediaQuery';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';

interface Props {
  _id: string;
  courseId: string;
  courseName: string;
  courseCode: string;
  time: Date;
  contents: string;
  title: string;
  author: {
    username: string;
    fullname: string;
    email: string;
  },
  color?: string;
  courseLink?: string;
  divider: boolean;
  mutate?: any;
}

function Announcement(props: Props) {
  const theme = useTheme();
  const auth = useStore(authStore);
  const [open, setOpen] = React.useState(false);
  const [scroll, setScroll] = React.useState<DialogProps['scroll']>('paper');
  const fullScreenDialog = useMediaQuery(theme.breakpoints.down('sm'));

  const handleClickOpen = (scrollType: DialogProps['scroll']) => () => {
    setOpen(true);
    setScroll(scrollType);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const descriptionElementRef = React.useRef<HTMLElement>(null);
  React.useEffect(() => {
    if (open) {
      const { current: descriptionElement } = descriptionElementRef;
      if (descriptionElement !== null) {
        descriptionElement.focus();
      }
    }
  }, [open]);

  return (
    <div>
      <ListItem button divider={props.divider} onClick={handleClickOpen('paper')}>
        <Grid container direction="row">
          { props.color &&
          <Grid item style={{ paddingRight: '4px', paddingTop: '1px' }}>
            <FiberManualRecordIcon style={{ color: props.color }} />
          </Grid>
          }
          <Grid item xs>
            <Box style={{ flex: 1 }}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item xs>
                  <Typography variant="subtitle1">
                    {props.courseCode}
                  </Typography>
                </Grid>
                <Grid item>
                  <Typography variant="body2" color="textSecondary" align="right">
                    <TimeAgo date={props.time} />
                  </Typography>
                </Grid>
              </Grid>
              <Box>
                <Typography variant="subtitle2">
                  <Truncate lines={1}>
                    {props.title}
                  </Truncate>
                </Typography>
              </Box>
              <Box>
                <Typography variant="body2">
                  <Truncate lines={2}>
                    {props.contents}
                  </Truncate>
                </Typography>
              </Box>
            </Box>
          </Grid>
        </Grid>
      </ListItem>
      <Dialog
        fullScreen={fullScreenDialog}
        fullWidth={true}
        maxWidth='md'
        open={open}
        onClose={handleClose}
        scroll={scroll}
        aria-labelledby="scroll-dialog-title"
        aria-describedby="scroll-dialog-description"
      >
        <DialogTitle id="scroll-dialog-title">
          {props.title}
          <Typography variant="subtitle1">
            {props.courseCode}: {props.courseName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            Posted on {moment(props.time).format('dddd, MMMM Do YYYY [at] h:mm:ss a')}
            &nbsp;by {props.author.fullname} ({props.author.email})
          </Typography>
        </DialogTitle>
        <DialogContent dividers={scroll === 'paper'}>
          <DialogContentText
            id="scroll-dialog-description"
            ref={descriptionElementRef}
            tabIndex={-1}
          >
            <div style={{whiteSpace: 'pre-wrap'}}>
              <Typography variant="body1" color="textPrimary">
                {props.contents}
              </Typography>
            </div>
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="secondary">
            Close
          </Button>
          { auth.userType === 'staff' &&
          <EditAnnouncement
            courseId={props.courseId}
            announcementId={props._id}
            title={props.title}
            contents={props.contents}
            mutate={props.mutate}
          />
          }
          { auth.userType === 'staff' &&
          <DeleteAnnouncement
            courseId={props.courseId}
            announcementId={props._id}
            mutate={props.mutate}
          />
          }
          { props.courseLink &&
          <Button component={Link} to={props.courseLink} onClick={handleClose} variant="outlined" color="secondary">
            Go To Course
          </Button>
          }
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default Announcement;

