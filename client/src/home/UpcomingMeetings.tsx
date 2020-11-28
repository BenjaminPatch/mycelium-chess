import React from 'react';
import useSWR from 'swr';
import { getCourseColor, getReadableTimeStamp } from '../util';
import CreateUpcomingMeeting from './CreateUpcomingMeeting';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import { authStore } from "../App";
import { useStore } from "effector-react";
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import List from '@material-ui/core/List';
import moment from 'moment';
import Divider from '@material-ui/core/Divider';
import ActionableMeetingItem from './ActionableMeetingItem';
import ArrowForwardIcon from '@material-ui/icons/ArrowForward';
import { CircularProgress } from '@material-ui/core';
import { useHistory } from 'react-router-dom';
import { Pagination } from '@material-ui/lab';

interface Meeting {
  _id: string;
  courseCode: string;
  courseId: string;
  name: string;
  time: Date;
  duration: number;
  type: string;
  owner: string;
  color?: string;
};

interface Course {
  _id: string;
  code: string;
};

interface Props {
  title: string;
  type: string;
  course?: Course;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: 'center',
      padding: theme.spacing(2, 0, 1, 0),
    },
    list: {
      padding: theme.spacing(1, 0, 0, 0),
    },
    buttons: {
      padding: theme.spacing(1, 0),
    },
    pagination: {
      padding: theme.spacing(1, 0),
    },
  }),
);

export function noUpcomingItems(meeting: string) {
  return (
    <ListItem >
      <Grid container direction="row">

        <Grid item xs>
          <Box style={{ flex: 1 }}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item xs>
                <Typography variant="body2" color="textSecondary" align="center">
                  {"It looks like you don't have any " + meeting.toLowerCase() + "."}
                </Typography>
                <Typography variant="body2">
                  {""}
                </Typography>
              </Grid>

            </Grid>
          </Box>
        </Grid>
      </Grid >
    </ListItem >
  )
}

const meetingsPerPage = 5;

/** Returns list view of upcoming classes for a given course or all courses 
 * 
 * @param props information relating to upcoming classes 
*/
function UpcomingMeetings(props: Props) {
  const classes = useStyles();
  var query: string;
  const fetcher = (url: any) => fetch(url).then(r => r.json());

  const history = useHistory();
  const auth = useStore(authStore);

  const [page, setPage] = React.useState(1);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (props.course) {
    query = `/api/courses/${props.course._id}/meetings`;
  } else {
    query = `/api/meetings`;
  }

  const { data, error, mutate } = useSWR(query, fetcher);

  if (error) {
    return (
      <Paper elevation={0} variant="outlined" square>
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h5" className={classes.title}>
              {props.title}
            </Typography>
          </Grid>
          <Grid item>
            <Typography variant="body1">
              Failed to load
            </Typography>
          </Grid>
        </Grid>
      </Paper>
    )
  }

  const loading = !data;

  let allMeetings: Meeting[];
  if (loading) {
    allMeetings = [];
  } else {
    // Only show meetings of the specified type, e.g. "class" or "consult"
    allMeetings = data.data.filter((m: Meeting) => m.type === props.type);
  }

  // Convert string dates from API to JS Date objects
  for (let i = 0; i < allMeetings.length; ++i) {
    allMeetings[i].time = moment.utc(allMeetings[i].time).toDate();
  };

  // Add meeting colours if this is not a specific course's meeting
  if (!props.course) {
    allMeetings.forEach((meeting: Meeting) => {
      meeting.color = getCourseColor(meeting.courseCode, auth.courses);
    })
  }

  // Add course ID to meeting if meetings for all courses are being displayed
  if (props.course) {
    allMeetings.forEach((meeting: Meeting) => {
      meeting.courseId = props.course!._id;
    })
  }

  /* Only show meetings on the currently selected page (pagination) */
  let meetings = allMeetings.filter((meeting: any, i: number) => {
    return (page - 1) * meetingsPerPage <= i && i < page * meetingsPerPage;
  });

  return (
    <Paper elevation={0} variant="outlined" square>
      <Grid container direction="column" alignItems="center">
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            {props.title}
          </Typography>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <List disablePadding={true} className={classes.list}>
            <Divider />
            { loading &&
              <Grid container justify="center" alignItems="center" style={{ padding: "16px 0" }}>
                <CircularProgress />
              </Grid>
            }
            {!loading && meetings.length == 0 &&
              noUpcomingItems(props.title)
            }
            {!loading && meetings.length > 0 && meetings.map((meeting: Meeting, i: number) => (
                <ActionableMeetingItem
                  title={props.course ? meeting.name : meeting.courseCode + " " + meeting.name}
                  time={meeting.time}
                  byline={getReadableTimeStamp(meeting.time)}
                  courseCode={meeting.courseCode}
                  courseId={meeting.courseId}
                  meetingId={meeting._id}
                  meetingName={meeting.name}
                  meetingTime={meeting.time}
                  meetingDuration={meeting.duration}
                  color={meeting.color}
                  buttonText={"Join"}
                  buttonIcon={<ArrowForwardIcon />}
                  canEdit={auth.userType === 'staff'}
                  onClick={async () => {
                    history.push(
                      `/meeting/join?id=${meeting._id}`);
                  }}
                  mutate={mutate}
                />
              ))}
          </List>
        </Grid>
        {allMeetings.length > 0 &&
        <Grid item>
          <Pagination
            count={Math.ceil(allMeetings.length / meetingsPerPage)}
            page={page}
            onChange={handleChangePage}
            className={classes.pagination}
          />
        </Grid>
        }
        {props.course && auth.userType === 'staff' &&
          <Grid item container justify="center">
            <Grid item className={classes.buttons}>
              <CreateUpcomingMeeting
                type={props.type}
                courseId={props.course._id}
              />
            </Grid>
          </Grid>
        }
      </Grid>
    </Paper>
  );
}

export {UpcomingMeetings as default};
