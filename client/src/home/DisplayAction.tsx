import React from 'react';
import TimeAgo from 'react-timeago';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import moment from 'moment';
import { SvgIconProps } from '@material-ui/core';

//@TODO change to not any, change to not optional

interface Props {
  time: Date,
  buttonText: string,
  buttonIcon: React.ReactElement<SvgIconProps>,
  alwaysButton?: boolean,
  onClick?: any,
}

/** Returns button component (or text component) for an upcoming meeting.
 * No button is displayed if class is more than 5 minutes away. grey color button for if
 * it is within 5 minutes. Colored button if class is starting already
 * 
 * @param props information relating to the button component
 */
function DisplayAction(props: Props) {

  // always button: false if undefined, if defined that value.
  var alwaysButton = props.alwaysButton !== undefined || props.alwaysButton

  if (moment(props.time).isAfter(moment().add(5, 'minutes')) && !alwaysButton) {
    // class is far away && not always a button
    return (
      <Typography variant="body2" color="textSecondary" align="right" >
        <TimeAgo date={props.time} />
      </Typography>
    );
  }

  // join button
  return (<Button
    variant="contained"
    endIcon={props.buttonIcon}
    onClick={props.onClick}
    color={moment(props.time).isBefore(moment()) || alwaysButton ? "secondary" : "default"} >
    {props.buttonText}
  </Button>);

}

export default DisplayAction;
