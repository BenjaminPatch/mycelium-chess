import React from 'react';

import Announcement from '../home/Announcement';
import CreateAnnouncement from './CreateAnnouncement';
import { authStore } from "../App";

import useSWR from 'swr';
import { useStore } from "effector-react";

import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';

import {
  Typography,
  Paper,
  Grid,
  List,
  Divider,
  CircularProgress,
}  from '@material-ui/core';

import {
  Pagination,
} from '@material-ui/lab';

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
};

interface Props {
  courseId: string;
  courseCode: string;
  courseName: string;
};

const fetcher = (url: any) => fetch(url).then(r => r.json())

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paperHeading: {
      textAlign: 'center',
      padding: theme.spacing(2, 0),
    },
    pagination: {
      padding: theme.spacing(1, 0),
    },
    buttons: {
      padding: theme.spacing(1, 0),
    },
  }),
);

const announcementsPerPage = 4;

function CourseAnnouncements(props: Props) {
  const classes = useStyles();
  const { data, error, mutate } = useSWR(`/api/courses/${props.courseId}/announcements`, fetcher);
  const auth = useStore(authStore);
  const [page, setPage] = React.useState(1);

  const handleChangePage = (event: React.ChangeEvent<unknown>, value: number) => {
    setPage(value);
  };

  if (error) {
    return (
      <Paper>
        <Typography variant="h5" className={classes.paperHeading}>Error</Typography>
      </Paper>
    );
  }

  if (!data || !data.data) {
    return (
      <Paper elevation={0} variant="outlined" square>
        <Typography variant="h5" className={classes.paperHeading}>
          Announcements
        </Typography>
        <Grid container justify="center" alignItems="center">
          <CircularProgress />
        </Grid>
      </Paper>
    );
  }

  let allAnnouncements = data.data;
  /* Only show announcements on the currently selected page (pagination) */
  let announcements = allAnnouncements.filter((announcement: any, i: number) => {
    return (page - 1) * announcementsPerPage <= i && i < page * announcementsPerPage;
  });

  return (
    <Paper elevation={0} variant="outlined" square>
      <Grid container direction="column" alignItems="center">
        <Grid item className={classes.paperHeading}>
          <Typography variant="h5">
            Announcements
          </Typography>
        </Grid>
        <Grid item style={{ width: '100%' }}>
          <List disablePadding={true}>
            <Divider />
            {announcements.map((announcement: Announcement, i: number) => (
              <Announcement 
                key={announcement._id}
                _id={announcement._id}
                courseId={props.courseId}
                courseName={props.courseName}
                courseCode={props.courseCode}
                time={announcement.time}
                contents={announcement.contents}
                title={announcement.title}
                author={announcement.author}
                divider={true}
                mutate={mutate}
              />
            ))}
          </List>
        </Grid>
        {allAnnouncements.length > 0 &&
        <Grid item>
          <Pagination
            count={Math.ceil(allAnnouncements.length / announcementsPerPage)}
            page={page}
            onChange={handleChangePage}
            className={classes.pagination}
          />
        </Grid>
        }
        { auth.userType === 'staff' ?
        <Grid item container justify="center">
          <Grid item className={classes.buttons}>
            <CreateAnnouncement
              courseId={props.courseId}
              courseCode={props.courseCode}
              courseName={props.courseName}
              mutate={mutate}
            />
          </Grid>
        </Grid>
        : '' }
      </Grid>
    </Paper>
  );
}

export default CourseAnnouncements;



