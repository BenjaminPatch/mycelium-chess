import React from 'react';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import MoreHorizIcon from '@material-ui/icons/MoreHoriz';

/** Returns component for 3 horizontal dots */
function MoreInformation() {
  return (
    <Grid item container justify="center">
      <Grid item>
        <IconButton size="small">
          <MoreHorizIcon />
        </IconButton>
      </Grid>
    </Grid>
  );
}

export default MoreInformation;



