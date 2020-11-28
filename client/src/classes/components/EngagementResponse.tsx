import React from 'react';

import { getEmotionIcon } from '../../util';

// import { useAppState } from '../providers/AppStateProvider';
import { DataMessage } from "amazon-chime-sdk-js";

import {
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  Button,
  Divider,
  Badge,
} from '@material-ui/core';

type Props = {
  responses: DataMessage[],
  clear: () => void
}

function EngagementResponse(props: Props) {
  let { responses, clear } = props;
  // const { setIsEngagementResponse } = useAppState();

  const getResponseCount = function(response: string) {
    let sum = 0;
    for (let i = 0; i < responses.length; i++) {
      if (responses[i].text() === response) {
        sum++;
      }
    }
    return sum;
  }

  const pushAndRender = function(message: string) {
    visited.push(message);
    return (
      <ListItem key={message}>
        <ListItemAvatar>
          <Badge badgeContent={getResponseCount(message)} color="secondary">
            <Avatar style={{ backgroundColor: 'lightgray' }}>
              {getEmotionIcon(message)}
            </Avatar>
          </Badge>
        </ListItemAvatar>
        <ListItemText primary={message} />
      </ListItem>
    );
  }

  let visited: String[] = [];

  return (
    <React.Fragment>
      <div style={{ width: '100%' }}>
        <Divider />
      </div>
      <List style={{ width: '100%' }}>
        {responses.map((message) => (
          visited.indexOf(message.text()) !== -1 ? null : (pushAndRender(message.text())))
        )}
      </List>
      <Button variant="outlined" onClick={clear}>
        Clear Responses
      </Button>
    </React.Fragment>
  );
}

export default EngagementResponse;