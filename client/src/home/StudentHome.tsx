import React from 'react';
import Announcements from './Announcements';
import UserCalendar from '../calendar/Calendar';
import UpcomingMeetings from './UpcomingMeetings';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import { Link } from 'react-router-dom';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Container from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';
import Box from '@material-ui/core/Box';
import Divider from '@material-ui/core/Divider';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    calendarHeading: {
      padding: theme.spacing(0, 0, 2, 0),
    },
    calendarBox: {
      padding: theme.spacing(2, 0, 2, 0),
    },
  }),
);

function Home() {
  const classes = useStyles();

  return (
    <Container maxWidth="lg">
      <Grid container spacing={3}>
        <Grid item xs={12} md={7}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Paper className={classes.paper} elevation={0} variant="outlined" square>
                <Typography variant="h5" className={classes.calendarHeading}>
                  Calendar
                </Typography>
                <Divider />
                <Box className={classes.calendarBox}>
                  <UserCalendar size="small" limited={true} />
                </Box>
                <Button component={Link} to="/calendar" size="small">
                  View full calendar
                </Button>
              </Paper>
            </Grid>
            <Grid item>
              <UpcomingMeetings
                title="Upcoming Classes"
                type="class" />
            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} md={5}>
          <Grid container direction="column" spacing={3}>
            <Grid item>
              <Announcements />
            </Grid>
            <Grid item>
              <UpcomingMeetings
                title="Tutor Consultations"
                type="consult" />
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}

export default Home;
