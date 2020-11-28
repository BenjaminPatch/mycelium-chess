import React from "react";

import useSWR from 'swr';

import { StudySpace } from "../model";
import CreateStudySpace from "./CreateStudySpace";
import StudySpacesList from "./StudySpacesList";
import JoinStudySpace from "./JoinStudySpace";

import { createStyles, makeStyles, Theme } from "@material-ui/core/styles";

import {
  Typography,
  Paper,
  Grid,
  Container,
  CircularProgress,
} from "@material-ui/core";

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    title: {
      textAlign: "center",
      padding: theme.spacing(2, 0, 2, 0),
    },
    buttonBar: {
      padding: theme.spacing(1, 2, 2, 2),
    },
  })
);

const fetcher = (url: any) => fetch(url).then(r => r.json())

function StudySpaces() {
  const classes = useStyles();

  const { data, error, mutate } = useSWR(`/api/studyspaces`, fetcher);

  if (error) {
    return <div>Error</div>;
  }

  if (!data || !data.data) {
    return (
      <Container maxWidth="md">
        <Paper
          elevation={0}
          variant="outlined"
          square
          style={{ paddingBottom: 16 }}
        >
          <Grid container direction="column" justify="center" alignItems="center">
            <Grid item>
              <Typography variant="h4" className={classes.title}>
                Study Spaces
              </Typography>
            </Grid>
            <Grid item>
              <CircularProgress />
            </Grid>
          </Grid>
        </Paper>
      </Container>
    );
  }

  const spaces: StudySpace[] = data.data;

  return (
    <Container maxWidth="md">
      <Paper
        elevation={0}
        variant="outlined"
        square
      >
        <Grid container direction="column">
          <Grid item>
            <Typography variant="h4" className={classes.title}>
              Study Spaces
            </Typography>
          </Grid>
          <Grid item>
            <StudySpacesList studySpaces={spaces} mutate={mutate} />
          </Grid>
          <Grid item container spacing={1} justify="flex-end" className={classes.buttonBar}>
            <Grid item>
              <JoinStudySpace mutate={mutate} />
            </Grid>
            <Grid item>
              <CreateStudySpace mutate={mutate} />
            </Grid>
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}

export default StudySpaces;
