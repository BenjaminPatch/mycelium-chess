import React, { Component } from 'react';
import EditMeeting from "./EditMeeting";
import DeleteMeeting from "./DeleteMeeting";
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import ListItem from '@material-ui/core/ListItem';
import Box from '@material-ui/core/Box';
import FiberManualRecordIcon from '@material-ui/icons/FiberManualRecord';
import DisplayAction from './DisplayAction';
import { SvgIconProps } from '@material-ui/core';

//@TODO refactor: make button info, onclick, text and always button a seperate ButtonInfo interface
interface Props {
  title: string,
  byline: string,
  courseId: string,
  courseCode: string,
  meetingId: string,
  meetingName: string;
  meetingTime: Date;
  meetingDuration: number;
  time: Date,
  color?: string,
  canEdit: boolean,

  mutate?: any,
  onClick?: any, //@TODO change to not any, change to not optional
  buttonText: string,
  buttonIcon: React.ReactElement<SvgIconProps>,
  alwaysButton?: boolean
}

class ActionableMeetingItem extends Component<Props, { isHovering: boolean }> {
  constructor(props: any) {
    super(props);
    this.handleMouseHover = this.handleMouseHover.bind(this);
    this.state = {
      isHovering: false,
    };
  }

  handleMouseHover() {
    this.setState(this.toggleHoverState);
  }

  toggleHoverState(state: any) {
    return {
      isHovering: !state.isHovering,
    };
  }

  render() {
    
    return (
      <ListItem divider >

        {/** Color dot to be shown only iff given a color */}
        <Grid container direction="row"
          onMouseEnter={this.handleMouseHover}
          onMouseLeave={this.handleMouseHover}>

          {this.props.color &&
            <Grid item style={{ paddingRight: '4px', paddingTop: '2px' }}>
              <FiberManualRecordIcon style={{ color: this.props.color }} />
            </Grid> }
          <Grid item xs>
            <Box style={{ flex: 1 }}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item xs>
                  <Typography variant="body1">
                    {this.props.title}
                  </Typography>
                  <Typography variant="body2">
                    {this.props.byline}
                  </Typography>
                </Grid>

                {/** Edit action for list item */
                  this.props.canEdit ?
                    /** Edit action for list item */
                    this.state.isHovering ?
                      <div style={{ marginRight: '8px' }}>
                        <EditMeeting
                          courseId={this.props.courseId}
                          meetingId={this.props.meetingId}
                          meetingName={this.props.meetingName}
                          meetingTime={this.props.meetingTime}
                          meetingDuration={this.props.meetingDuration}
                          mutate={this.props.mutate}
                        />
                        <DeleteMeeting
                          courseId={this.props.courseId}
                          meetingId={this.props.meetingId}
                          mutate={this.props.mutate}
                        />
                      </div>
                      : ''
                    : ''}

                <Grid item>

                  {/** Go to Button Action for list item */}
                  <DisplayAction
                    time={this.props.time}
                    buttonText={this.props.buttonText}
                    buttonIcon={this.props.buttonIcon}
                    alwaysButton={this.props.alwaysButton}
                    onClick={this.props.onClick}
                  />
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      </ListItem >
    );
  }
}

export default ActionableMeetingItem;



