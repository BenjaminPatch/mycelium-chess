import React from 'react';
import useSWR from 'swr';
import moment from "moment";
import { Course } from "../model";
import AssessmentItem from "./AssessmentItem";
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Paper from '@material-ui/core/Paper';
import { authStore } from "../App";
import { useStore } from "effector-react";
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import CreateAssessment from './CreateAssessment';
import {noUpcomingItems} from '../home/UpcomingMeetings'
import { CircularProgress } from '@material-ui/core';

interface Props {
  course: Course;
};

interface AssessmentItem {
  _id: string;
  title: string;
  desc: string;
  due: Date;
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(1, 0, 1, 0),
    },
    title: {
      textAlign: 'center',
      padding: theme.spacing(1, 0, 1, 0),
    },
    list: {
      padding: theme.spacing(1, 0, 0, 0),
    },
    buttons: {
      padding: theme.spacing(1, 0, 0, 0),
    },
  }),
);

function AssessmentItems(props: Props) {
  const classes = useStyles();
  const auth = useStore(authStore);
  const fetcher = (url: any) => fetch(url).then(r => r.json());

  const { data, error, mutate } = useSWR(`/api/courses/${props.course._id}/assessment`, fetcher);

  if (error) {
    return <div>Error: failed to load assessment</div>;
  }

  const loading = !data;

  let assessmentItems: AssessmentItem[] = [];
  if (!loading) {
    for (let i = 0; i < data.data.length; i++) {
      assessmentItems.push(data.data[i]);
      assessmentItems[i].due = moment.utc(assessmentItems[i].due).toDate();
    }
  }

  /* Only show upcoming assessment */
  assessmentItems = assessmentItems.filter((i: any) => i.due > moment().toDate());

  return (
    <Paper className={classes.paper} elevation={0} variant="outlined" square>
      <Grid container direction="column">
        <Grid item>
          <Typography variant="h5" className={classes.title}>
            Upcoming Assessment
          </Typography>
        </Grid>
        <Grid item>
          <List disablePadding={true} className={classes.list}>
            <Divider />
            {loading &&
            <Grid container justify="center" alignItems="center">
              <CircularProgress />
            </Grid>
            }
            {!loading && assessmentItems.length === 0 &&
              noUpcomingItems("Upcoming Assessment")
            }
            {!loading && assessmentItems.length > 0 && assessmentItems.map((item, i) => (
              <AssessmentItem
                course={props.course}
                assessment={item}
                mutate={mutate}
              />
            ))}
          </List>
        </Grid>

        { auth.userType === 'staff' &&
        <Grid item container justify="center">
          <Grid item className={classes.buttons}>
            <CreateAssessment
              course={props.course}
              mutate={mutate}
            />
          </Grid>
        </Grid>
        }
      </Grid>
    </Paper>
  );

}

export default AssessmentItems;

