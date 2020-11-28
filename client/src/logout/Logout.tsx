import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
  }),
);

function Logout() {
  const classes = useStyles();

  return (
    <Paper className={classes.paper}>
      <Typography variant="h2" gutterBottom>Goodbye!</Typography>
      <Typography variant="body1">
        You have been successfully logged out.
      </Typography>
    </Paper>
  );
}

export default Logout;

