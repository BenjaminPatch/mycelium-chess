import React from 'react';
import MeetingJoiner from './MeetingJoiner';
import { AppStateProvider } from '../providers/AppStateProvider';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import { ThemeProvider } from 'styled-components';
import { Meeting } from '.';
import {
  MeetingProvider,
  /*lightTheme*/
} from 'amazon-chime-sdk-component-library-react';
import NoMeetingRedirect from '../components/NoMeetingRedirect';
import { lightTheme } from '../utils/lightTheme'
import { useStore } from 'effector-react';
import { authStore } from '../../App';
const url = require('url');

type Props = {
    meetingId: string,
    name: string,
    isStaff: boolean
}

const commonTheme = {
    // Setting letter-spacing to 0 makes react-truncate calculate widths properly
    overrides: {
      MuiCssBaseline: {
        '@global': {
          body: {
            letterSpacing: '0',
          }
        }
      }
    },
    typography: {
      h1: {
        letterSpacing: '0',
      },
      h2: {
        letterSpacing: '0',
      },
      h3: {
        letterSpacing: '0',
      },
      h4: {
        letterSpacing: '0',
      },
      h5: {
        letterSpacing: '0',
      },
      h6: {
        letterSpacing: '0',
      },
      subtitle1: {
        letterSpacing: '0',
      },
      subtitle2: {
        letterSpacing: '0',
      },
      body1: {
        letterSpacing: '0',
      },
      body2: {
        letterSpacing: '0',
      },
      button: {
        letterSpacing: '0',
      },
      caption: {
        letterSpacing: '0',
      },
      overline: {
        letterSpacing: '0',
      },
    },
    palette: {
      type: 'dark',
      primary: {
        main: "#51247A",
        light: "#962A8B",
      },
      secondary: {
        main: "#4085C6",
        dark: "#1e66ab",
        light: "#6980ff",
      }
    }
  };
  
function JoinMeeting(props: Props) {
  const auth = useStore(authStore);

  const query = url.parse(window.location.href, true).query;

  let meetingId: string;
  // Prioritise props then URL query
  if (!props.meetingId) {
    meetingId = query.id;
  } else {
    meetingId = props.meetingId;
  }

  let isStaff = auth.userType === 'staff';
  let name = auth.firstname + " " + auth.lastname;

    return (
      <AppStateProvider>
        <ThemeProvider theme={lightTheme}>
          <MeetingProvider>
              <Switch>
                <Route exact path = "/meeting/join" component={() =>
                  <MeetingJoiner meetingId={meetingId} attendeeName={name} isStaff={isStaff}/> } />
                <Route path="/meeting">
                  <NoMeetingRedirect>
                    <Meeting />
                  </NoMeetingRedirect>
                </Route>
              </Switch>
          </MeetingProvider>
        </ThemeProvider>
      </AppStateProvider>
    );
  }

export default JoinMeeting;
