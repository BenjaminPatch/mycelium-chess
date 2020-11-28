import React from "react";

import { Course, Assessment } from "../model";
import AssessmentView from "./AssessmentView";
import EditAssessment from "./EditAssessment";
import DeleteAssessment from "./DeleteAssessment";
import { authStore } from "../App";
import { getReadableDateStamp, getReadableTimeStamp } from "../util";

import { useStore } from "effector-react";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  Grid,
  Box,
  Typography,
  IconButton,
  ListItem,
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    buttonBox: {
      display: 'flex',
      alignItems: 'center',
    },
  })
);

interface Props {
  course: Course;
  assessment: Assessment;
  mutate?: any;
}

function AssessmentItem(props: Props) {
  const auth = useStore(authStore);
  const classes = useStyles();
  const [hover, setHover] = React.useState(false);

  return (
    <ListItem
      divider
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <Grid container direction="row" justify="space-between" alignItems="center">
        <Grid item xs>
          <Typography variant="body1">
            {props.assessment.title}
          </Typography>
          <Typography variant="body2">
            {getReadableDateStamp(props.assessment.due) + ", " + getReadableTimeStamp(props.assessment.due)}
          </Typography>
        </Grid>
        <Grid item>
          <Box className={classes.buttonBox}>
            {auth.userType === 'staff' && hover &&
            <div style={{ marginRight: '8px' }}>
              <EditAssessment
                course={props.course}
                assessment={props.assessment}
                mutate={props.mutate}
              />
              <DeleteAssessment
                courseId={props.course._id}
                assessment={props.assessment}
                mutate={props.mutate}
              />
            </div>
            }
            <AssessmentView
              course={props.course}
              assessment={props.assessment}
            />
          </Box>
        </Grid>
      </Grid>
    </ListItem>
  )
}

export default AssessmentItem;

