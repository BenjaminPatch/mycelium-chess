import React from 'react';
import clsx from 'clsx';
import useSWR from 'swr';
import { Link, useLocation } from 'react-router-dom';
import { createStyles, makeStyles, useTheme, Theme } from '@material-ui/core/styles';
import { authStore } from "../App";
import { useStore } from "effector-react";
import { getCourseColor } from '../util';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import { Tooltip } from '@material-ui/core';
import SchoolOutlinedIcon from '@material-ui/icons/SchoolOutlined';
import InsertInvitationOutlinedIcon from '@material-ui/icons/InsertInvitationOutlined';
import HomeOutlinedIcon from '@material-ui/icons/HomeOutlined';
import ExpandMore from '@material-ui/icons/ExpandMore';
import ExpandLess from '@material-ui/icons/ExpandLess';
import BookOutlinedIcon from '@material-ui/icons/BookOutlined';
import ForumOutlined from '@material-ui/icons/ForumOutlined';

interface Course {
  _id: string,
  code: string;
  name: string;
  staff: string[];
};

const drawerWidth = 230;

const fetcher = (url: any) => fetch(url).then(r => r.json())

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      zIndex: theme.zIndex.drawer + 1,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      background: 'linear-gradient(to right, #51247A 74%, #962A8B)',
    },
    appBarShift: {
      marginLeft: drawerWidth,
      width: `calc(100% - ${drawerWidth}px)`,
      transition: theme.transitions.create(['width', 'margin'], {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    toolbar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'flex-start',
      padding: theme.spacing(0, 1),
      // necessary for content to be below app bar
      ...theme.mixins.toolbar,
    },
    menuButton: {
      marginRight: 36,
    },
    hide: {
      display: 'none',
    },
    drawer: {
      width: drawerWidth,
      flexShrink: 0,
      whiteSpace: 'nowrap',
    },
    drawerOpen: {
      width: drawerWidth,
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.enteringScreen,
      }),
    },
    drawerClose: {
      transition: theme.transitions.create('width', {
        easing: theme.transitions.easing.sharp,
        duration: theme.transitions.duration.leavingScreen,
      }),
      overflowX: 'hidden',
      width: theme.spacing(7) + 1,
      [theme.breakpoints.up('sm')]: {
        width: theme.spacing(7),
      },
    },
  }),
);

type Props = {
  children: React.ReactNode
};

const studentNavItems = [
  {
    name: 'Home',
    longName: 'Home',
    url: '/',
    icon: <HomeOutlinedIcon />,
  },
  {
    name: 'Calendar',
    longName: 'Class Calendar',
    url: '/calendar',
    icon: <InsertInvitationOutlinedIcon />,
  },

  {
    name: 'Study Spaces',
    longName: 'Study Spaces',
    url: '/study',
    icon: <ForumOutlined />,
  },
];

const staffNavItems = [
  {
    name: 'Home',
    longName: 'Home',
    url: '/',
    icon: <HomeOutlinedIcon />,
  },
];

function Navigation(props: Props) {
  const classes = useStyles();
  const theme = useTheme();
  const [open, setOpen] = React.useState(true);
  const [coursesOpen, setCoursesOpen] = React.useState(true);
  const auth = useStore(authStore);
  const { data, error } = useSWR('/api/courses', fetcher, { revalidateOnFocus: false });
  let curRoute = useLocation();

  if (error) {
    return <div>Error: failed to load courses</div>;
  }

  let courses: Course[];
  if (!data || !data.data) {
    courses = [];
  } else {
    courses = data.data;
  }

  const navItems = auth.userType === 'staff' ? staffNavItems : studentNavItems;

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleCoursesClick = () => {
    setCoursesOpen(!coursesOpen);
  };

  return (
    <div>
      <AppBar
        position="fixed"
        className={clsx(classes.appBar, {
          [classes.appBarShift]: open,
        })}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open side navigation"
            onClick={handleDrawerOpen}
            edge="start"
            className={clsx(classes.menuButton, {
              [classes.hide]: open,
            })}
          >
            <MenuIcon />
          </IconButton>
          {props.children}
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        className={clsx(classes.drawer, {
          [classes.drawerOpen]: open,
          [classes.drawerClose]: !open,
        })}
        classes={{
          paper: clsx({
            [classes.drawerOpen]: open,
            [classes.drawerClose]: !open,
          }),
        }}
      >
        <div className={classes.toolbar}>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <List>
          {navItems.map((navItem, i) => (
            <Tooltip title={navItem.name} placement="right" arrow={true} disableHoverListener={open} interactive key={navItem.name}>
              <ListItem button component={Link} to={navItem.url} onClick={handleDrawerClose} selected={curRoute.pathname === navItem.url}>
                <ListItemIcon>
                  {navItem.icon}
                </ListItemIcon>
                <ListItemText primary={navItem.longName} />
              </ListItem>
            </Tooltip>
          ))}
          <Tooltip title="Courses" placement="right" arrow={true} disableHoverListener={open} interactive>
            <ListItem button key="Courses" onClick={handleCoursesClick}>
              <ListItemIcon>
                <SchoolOutlinedIcon />
              </ListItemIcon>
              <ListItemText primary="Courses" />
              {coursesOpen ? <ExpandLess /> : <ExpandMore />}
            </ListItem>
          </Tooltip>
          <Collapse in={coursesOpen} timeout="auto" unmountOnExit>
            <List component="div" disablePadding>
              {courses.map((course, i) => (
                <Tooltip title={course.code} placement="right" arrow={true} disableHoverListener={open} interactive key={course._id}>
                  <ListItem button component={Link} to={`/courses/${course._id}`} onClick={handleDrawerClose}>
                    <ListItemIcon>
                      <BookOutlinedIcon style={{ color: getCourseColor(course.code, courses.map(c => c.code)) }} />
                    </ListItemIcon>
                    <ListItemText primary={course.code} />
                  </ListItem>
                </Tooltip>
              ))}
            </List>
          </Collapse>
        </List>
      </Drawer>
    </div>
  );
}

export default Navigation;

