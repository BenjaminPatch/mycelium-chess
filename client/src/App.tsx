import React, { useEffect } from 'react';
import Navigation from './navigation/Navigation';
import Home from './home/Home';
import JoinMeeting from './classes/views/JoinMeeting';
import MeetingOver from './classes/components/MeetingOver';
import UserCalendar from './calendar/Calendar';
import StudySpaces from './studyspaces/StudySpaces';
import Course from './courses/Course';
import { SnackbarProvider } from 'notistack';
import { Switch, Route, useLocation } from 'react-router-dom';
import { MuiPickersUtilsProvider } from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import { createStyles, makeStyles, createMuiTheme, Theme, responsiveFontSizes } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import Typography from '@material-ui/core/Typography';
import CssBaseline from '@material-ui/core/CssBaseline';
import Grid from '@material-ui/core/Grid';
import Box from '@material-ui/core/Box';
import { createApi, createDomain, createEffect, createStore } from "effector";
import { useStore } from "effector-react";
import { CircularProgress, Divider, IconButton } from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle';
import Brightness4OutlinedIcon from '@material-ui/icons/Brightness4Outlined';
import Brightness5OutlinedIcon from '@material-ui/icons/Brightness5Outlined';
import StudySpaceView from './studyspaces/StudySpaceView';

const AuthDomain = createDomain();

interface Auth {
  name: string;
  firstname: string;
  lastname: string;
  username: string;
  email: string;
  userType: string; // 'student' or 'staff'
  courses?: string[]; // courses student is enrolled in
};

const initialAuthState: Auth = {
  name: "",
  firstname: "",
  lastname: "",
  username: "",
  email: "",
  userType: "",
};

const authStore = AuthDomain.store<Auth>(initialAuthState);

const darkModeStore = createStore(localStorage.getItem('darkMode') === null ? false : JSON.parse(localStorage.getItem('darkMode') || 'false') as boolean);
const darkModeApi = createApi(darkModeStore, {
    toggleDarkMode: (cur) => !cur,
    //setDarkMode: (_cur, newState: boolean) => newState
});

const currentTitleStore = createStore<string>("");
const currentTitleStoreApi = createApi(currentTitleStore, {
    setTitle: (_cur, newTitle: string) => newTitle
});

darkModeStore.watch(newMode => {
    localStorage.setItem('darkMode', JSON.stringify(newMode));
})

const getAuthData = createEffect({
    handler: async() => {
      const req = await fetch(`${window.location.origin}/api/auth`)
      return req.json()
    }
});

authStore.on(getAuthData.done, ((_, {result}) => (
  {
    name: result.name,
    firstname: result.firstname,
    lastname: result.lastname,
    username: result.user,
    email: result.email,
    userType: result.type === 'Student' ? 'student' : 'staff',
    courses: result.courses,
  }
)));

const isAuthLoading = createStore(false).on(getAuthData.done, (_, __) => true);

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
    primary: {
      main: "#51247A",
      light: "#962A8B",
    },
    secondary: {
      main: "#4085C6",
      dark: "#1e66ab",
      light: "#6980ff",
    },
  }
};

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    root: {
      display: 'flex',
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    content: {
      flexGrow: 1,
      padding: theme.spacing(3),
    },
    paper: {
      padding: theme.spacing(2),
      textAlign: 'center',
    },
    dividerPad: {
      marginLeft: theme.spacing(1),
      marginRight: theme.spacing(1)
    },
    loadingScreen: {
      display: 'flex',
      justifyContent:'center',
      alignItems: 'center',
      minHeight: '100vh',
    },
  }),
);

const routes = [
  {
    path: "/",
    basePath: "",
    exact: true,
    appBarContents: <Typography variant="h6" noWrap>OnBoard</Typography>,
    mainContents: Home,
  },
  {
    path: "/calendar",
    basePath: "calendar",
    appBarContents: <Typography variant="h6" noWrap>Calendar</Typography>,
    mainContents: UserCalendar,
  },
  { // TODO this is just for testing and should be deleted eventually
    path: "/meeting",
    basePath: "meeting",
    //appBarContents: <Typography variant="h6" noWrap>Meetings</Typography>,
    mainContents: JoinMeeting,
  },
  {
    path: "/meeting-over",
    basePath: "meeting-over",
    appBarContents: <Typography variant="h6" noWrap>Meetings</Typography>,
    mainContents: MeetingOver,
  },
  {
    path: "/study",
    exact: true,
    basePath: "study",
    appBarContents: <Typography variant="h6" noWrap>Study Spaces</Typography>,
    mainContents: StudySpaces,
  },
  {
    path: "/study/:spaceId",
    basePath: "study",
    appBarContents: <Typography variant="h6" noWrap>TODO</Typography>,
    mainContents: StudySpaceView,
  },
  {
    path: "/courses/:courseId",
    basePath: "courses",
    //appBarContents: <Typography variant="h6" noWrap>Course Home</Typography>,
    mainContents: Course,
  },
];

function App() {
  const classes = useStyles();
  const auth = useStore(authStore);
  const authLoading = useStore(isAuthLoading);
  const darkMode = useStore(darkModeStore);
  let curRoute = useLocation();
  let currentTitle = useStore(currentTitleStore);

  const theme = React.useMemo(
    () =>
      responsiveFontSizes(createMuiTheme({
        palette: {
          type: darkMode ? 'dark' : 'light',
        },
      }, commonTheme)),
    [darkMode],
  );

  const getTitle = () => {
    var returnValue = routes.find(obj => curRoute.pathname.split('/')[1] === obj.basePath)?.appBarContents;
    if (!returnValue) {
      if (curRoute.pathname.includes("/meeting/join")) {
        return <Typography variant="h6" noWrap>Device Setup</Typography>;
      } else if (curRoute.pathname.includes("/meeting")) {
          return <Typography variant="h6" noWrap>{currentTitle}</Typography>;
      } else if (curRoute.pathname.includes("/courses")) {
        return <Typography variant="h6" noWrap>{currentTitle}</Typography>;
      } else {
        return <Typography variant="h6" noWrap>Unknown Page</Typography>;
      }
    }
    return returnValue;
  }

  const curTitle = React.useMemo(
      () => getTitle(),
      [curRoute, currentTitle]
  );

  useEffect(() => {
    getAuthData();
  }, []);

  return (
    <MuiPickersUtilsProvider utils={MomentUtils}>
      <SnackbarProvider maxSnack={3}>
        <ThemeProvider theme={theme}>
          { !authLoading ?
          <Box className={classes.loadingScreen}>
            <CircularProgress />
          </Box>
          :
          <div className={classes.root}>
            <CssBaseline />
            <Navigation>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  {curTitle}
                </Grid>
                <Grid item>
                  <Grid container alignItems="center">
                    <Grid item>
                      <IconButton color="inherit" onClick={(_) => darkModeApi.toggleDarkMode()}>
                        {darkMode ? <Brightness5OutlinedIcon /> : <Brightness4OutlinedIcon /> }
                      </IconButton>
                    </Grid>
                  <Divider className={classes.dividerPad} orientation="vertical" flexItem />
                  <Grid item>
                    <IconButton color="inherit">
                      <AccountCircle />
                    </IconButton>
                    </Grid>
                    <Grid item>
                      <Typography variant="h6">
                        Hi, {auth.firstname}!
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Navigation>
            <main className={classes.content}>
              <div className={classes.toolbar}></div>
              <Switch>
                {routes.map((route, index) => (
                  <Route key={index} path={route.path} exact={route.exact} component={route.mainContents} />
                ))}
              </Switch>
            </main>
          </div>
          }
        </ThemeProvider>
      </SnackbarProvider>
    </MuiPickersUtilsProvider>
  );
}

export { App, darkModeStore, authStore, currentTitleStoreApi };
