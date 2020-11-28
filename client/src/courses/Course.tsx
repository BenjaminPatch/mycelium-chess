import React, { useEffect } from 'react';
import CourseAnnouncements from './CourseAnnouncements';
import useSWR from 'swr';
import UpcomingMeetings from '../home/UpcomingMeetings';
import { RouteComponentProps } from 'react-router-dom';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import { CircularProgress } from '@material-ui/core';
import AssessmentItems from './AssessmentItems';
import { currentTitleStoreApi } from '../App';

const fetcher = (url: any) => fetch(url).then(r => r.json())

interface Course {
  courseId: string,
  code: string;
  name: string;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
    },
    paperHeading: {
      textAlign: 'center',
    },
  }),
);

function Course({ match }: RouteComponentProps<any>) {
  const classes = useStyles();
  const { data, error } = useSWR(`/api/courses/${match.params.courseId}`, fetcher);

  useEffect(() => {
      if (!!data) {
          currentTitleStoreApi.setTitle(data.data.code + ": " + data.data.name);
      }
  }, [data]);

  if (error) {
    return (
      <Paper className={classes.paper}>
        <Typography variant="h4" className={classes.paperHeading}>Error</Typography>
      </Paper>
    );
  }

  if (!data) {
    return (
      <Grid container justify="center" alignItems="center">
        <CircularProgress />
      </Grid>
    );
  }

  const course = data.data;

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h3" gutterBottom className={classes.paperHeading}>
            {course.code}
          </Typography>
          <Typography variant="h4" className={classes.paperHeading} color="textSecondary">
            {course.name}
          </Typography>
        </Grid>
        <Grid item xs={12} md={4}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <UpcomingMeetings
                title="Upcoming Classes"
                type="class"
                course={course}
              />
            </Grid>
            <Grid item>
              <UpcomingMeetings
                title="Tutor Consultations"
                type="consult"
                course={course}
              />

            </Grid>
            <Grid item>
              <AssessmentItems
                course={course}
              />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={8}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <CourseAnnouncements
                courseId={match.params.courseId}
                courseName={course.name}
                courseCode={course.code}
              />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Course;


