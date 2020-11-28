import React from 'react';
import fetch from 'unfetch';
import useSWR, { mutate } from 'swr';
import { authStore } from "../App";
import { useStore } from "effector-react";
import { getCourseColor } from '../util';
import Announcement from './Announcement';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MoreHozizIcon from '@material-ui/icons/MoreHoriz';
import { CircularProgress } from '@material-ui/core';
import Skeleton from '@material-ui/lab/Skeleton';

interface Announcement {
  _id: string,
  time: Date;
  title: string;
  contents: string;
  author: {
    username: string;
    fullname: string;
    email: string;
  },
  courseCode: string;
  courseName: string;
  courseId: string;
  color?: string;
};

const fetcher = (url: any) => fetch(url).then(r => r.json())

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1, 0, 0, 0),
    },
    title: {
      textAlign: 'center',
      padding: theme.spacing(1, 0, 1, 0),
    },
    announcementsList: {
      padding: theme.spacing(1, 0, 0, 0),
    },
  }),
);

function Announcements() {
  const classes = useStyles();
  const auth = useStore(authStore);
  const { data, error } = useSWR('/api/announcements', fetcher);

  if (error) return (
    <Paper className={classes.paper} elevation={0} variant="outlined" square>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            Announcements
          </Typography>
        </Grid>
        <Grid item>
          <Typography variant="body1">
            Failed to load
          </Typography>
        </Grid>
      </Grid>
    </Paper>
  );

  const loading = !data;

  let announcements: Announcement[];
  if (loading) {
    announcements = [];
  } else {
    announcements = data.data.slice(0, 5);
  }

  announcements.forEach((announcement: Announcement) => {
    announcement.color = getCourseColor(announcement.courseCode, auth.courses || []);
  });

  return (
    <Paper className={classes.paper} elevation={0} variant="outlined" square>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            Announcements
          </Typography>
        </Grid>
        <Grid item>
          <List className={classes.announcementsList}>
            <Divider />
            {announcements.map((announcement: Announcement, i: number) => (
              <Announcement 
                key={announcement._id}
                _id={announcement._id}
                courseId={announcement.courseId}
                courseName={announcement.courseName}
                courseCode={announcement.courseCode}
                time={announcement.time}
                contents={announcement.contents}
                title={announcement.title}
                author={announcement.author}
                color={announcement.color}
                divider={i < announcements.length - 1}
                courseLink={`/courses/${announcement.courseId}`}
                mutate={() => mutate(`/api/announcements`)}
              />
            ))}
            { loading &&
              <Grid container justify="center" alignItems="center" style={{ padding: "16px 0" }}>
                <CircularProgress />
              </Grid>
            }
          </List>
        </Grid>
      </Grid>
    </Paper>
  );
}

export default Announcements;

