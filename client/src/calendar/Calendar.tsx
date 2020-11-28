import React from "react";
import api from '../api';
import { getCourseColor } from '../util';
import './calendar.css';
import { DatePicker, DateTimePicker } from '@material-ui/pickers';
import { Calendar, momentLocalizer } from "react-big-calendar";
import { authStore } from "../App";
import { Link } from 'react-router-dom';
import moment from "moment";
import fetch from 'unfetch';
import useSWR, { mutate } from 'swr';
import { useSnackbar } from 'notistack';
import "react-big-calendar/lib/css/react-big-calendar.css";
import { darkModeStore } from "../App";
import { useStore } from "effector-react";
import Box from '@material-ui/core/Box';
import TextField from '@material-ui/core/TextField';
import Skeleton from '@material-ui/lab/Skeleton';
import Menu from '@material-ui/core/Menu';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import MenuItem from '@material-ui/core/MenuItem';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlineOutlined';
import SaveOutlinedIcon from '@material-ui/icons/SaveOutlined';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import withDragAndDrop from 'react-big-calendar/lib/addons/dragAndDrop'




const fetcher = (url: any) => fetch(url).then(r => r.json())

// Set first day of week view to be Monday
moment.locale('en', {
    week: {
        dow: 1,
        doy: 1,
    },
});

type Props = {
  size: string, // "large" or "small"
  limited?: boolean, // limited only shows month and agenda views
};

enum EventType {
  UserEvent,
  AssessmentEvent,
}

interface Event {
  _id: string;
  start: Date;
  end: Date;
  title: string;
  origTitle: string;
  desc: string;
  type: EventType;
  editable: boolean;

  // Fields specific to user-created events
  username?: string;

  // Fields specific to course assessment events
  due?: string;
  courseId?: string;
  courseCode?: string;
  courseName: string;
};



const timeLocaliser = momentLocalizer(moment);
export const Cal = (props: any) => (
  <Calendar localizer={timeLocaliser} {...props} />
)

const DragAndDrop = withDragAndDrop(Cal);

const initialEventMenu = {
  mouseX: null,
  mouseY: null,
};

function UserCalendar(props: Props) {
  const { data, error } = useSWR('/api/events', fetcher);
  const darkMode = useStore(darkModeStore);
  const auth = useStore(authStore);
  const { enqueueSnackbar } = useSnackbar();
  const [eventMenu, setEventMenu] = React.useState<{
    mouseX: null | number;
    mouseY: null | number;
  }>(initialEventMenu);
  // ID of last event clicked
  const [lastClicked, setLastClicked] = React.useState("");
  // Whether the dialog for viewing an event is open
  const [viewOpen, setViewOpen] = React.useState(false);
  // Whether the dialog for editing/creating an event is open
  const [editOpen, setEditOpen] = React.useState(false);
  // Whether the current event being edited is an all-day event
  const [allDay, setAllDay] = React.useState(false);
  const [allDayDate, setAllDayDate] = React.useState(new Date());

  const initialCurrentEvent = {
    _id: undefined,
    start: new Date(),
    end: new Date(),
    title: '',
    desc: '',
    username: auth.username,
    editable: false,
    type: EventType.UserEvent,
    courseId: '',
  };

  const [currentEvent, setCurrentEvent] = React.useState(initialCurrentEvent);

  if (error) {
    return <div>Error</div>;
  }
  if (!data) {
    return <Skeleton variant="rect" height={400} />;
  }

  let events: Event[] = [];
  for (let i = 0; i < data.data.length; ++i) {
    events[i] = data.data[i];
  }

  events.forEach(event => {
    /* Find the event type */
    if (event.username) {
      event.type = EventType.UserEvent;
      event.editable = true;
    } else {
      event.type = EventType.AssessmentEvent;
      event.editable = false;
    }

    /* Convert timestamps to JS date objects */
    if (event.type === EventType.AssessmentEvent) {
      event.start = moment.utc(event.due).toDate();
      event.end = moment.utc(event.due).add(60, 'minutes').toDate();
    } else {
      event.start = moment.utc(event.start).toDate();
      event.end = moment.utc(event.end).toDate();
    }
  });


  const handleClickViewOpen = (calEvent: any) => {
    setViewOpen(true);
    setLastClicked(calEvent._id);
    setCurrentEvent(calEvent);
  }

  const handleClickViewClose = () => {
    setViewOpen(false);
  }

  const handleClickEditOpen = () => {
    setEditOpen(true);

    const lastClickedEvent = events.find(e => e._id === lastClicked);
    if (lastClickedEvent) {
      setAllDayDate(moment(lastClickedEvent.start).startOf('day').toDate());
    }
  }

  const handleClickEditClose = () => {
    setEditOpen(false);
  }

  const handleChangeInputTitle = async (event: any) => {
    let newState = { ...currentEvent };
    newState.title = event.target.value;
    setCurrentEvent(newState);
  };

  const handleChangeInputDesc = async (event: any) => {
    let newState = { ...currentEvent };
    newState.desc = event.target.value;
    setCurrentEvent(newState);
  };

  const handleChangeInputAllDay = async (event: any) => {
    setAllDay(event.target.checked);

    let newState = { ...currentEvent };
    newState.start = allDayDate;
    newState.end = moment(allDayDate).add(1, 'days').toDate();
    setCurrentEvent(newState);
  };

  const handleChangeInputAllDayDate = async (newDate: any) => {
    setAllDayDate(newDate);

    let newState = { ...currentEvent };
    newState.start = allDayDate;
    newState.end = moment(allDayDate).add(1, 'days').toDate();
    setCurrentEvent(newState);
  };

  const handleChangeInputStart = async (newStart: any) => {
    let newState = { ...currentEvent };
    newState.start = newStart;
    setCurrentEvent(newState);
  };

  const handleChangeInputEnd = async (newEnd: any) => {
    let newState = { ...currentEvent };
    newState.end = newEnd;
    setCurrentEvent(newState);
  };

  const handleClose = () => {
    setEventMenu(initialEventMenu);
  };

  const handleDelete = async () => {
    await api.deleteEvent(lastClicked).then((res: any) => {
      if (!res.data) {
        enqueueSnackbar(`Failed to delete event`, { variant: 'error' });
        return;
      }
      mutate('/api/events');
      enqueueSnackbar(`Deleted "${res.data.data.title}"`, { variant: 'success' });
    });
  };

  const handleSubmit = async () => {
    if (currentEvent._id === undefined) {
      await api.insertEvent(currentEvent).then((res: any) => {
        mutate('/api/events');
      });
    } else {
      await api.updateEvent(currentEvent._id, currentEvent).then((res: any) => {
        mutate('/api/events');
      });
    }
  };

  const handleSelection = async (slotInfo: any) => {
    if (slotInfo.action === "select") {
      setLastClicked("");

      setCurrentEvent({
        _id: undefined,
        start: slotInfo.start,
        end: slotInfo.end,
        title: "",
        desc: "",
        username: auth.username,
        editable: false,
        type: EventType.UserEvent,
        courseId: '',
      });

      setEditOpen(true);
    }
  }

  const handleEventRightClick = (e: any, calEvent: any) => {
    e.preventDefault();
    if (!calEvent.editable) {
      return;
    }
    setEventMenu({
      mouseX: e.clientX - 2,
      mouseY: e.clientY - 4,
    });
    setLastClicked(calEvent._id);
    setCurrentEvent(calEvent);
  }


  const dropEvent = async (info: any) => {

    if (!info.event.editable) {
      return;
    }
    let updatedEvent = info.event;
    updatedEvent.start = info.start;
    updatedEvent.end = info.end;

    await api.updateEvent(updatedEvent._id, updatedEvent).then((res: any) => {
      mutate('/api/events');
    });
  }

  const eventStyleGetter = (event: any, start: any, end: any, isSelected: boolean) => {
    let eventColor;
    if (event.type === EventType.AssessmentEvent) {
      eventColor = getCourseColor(event.courseCode, auth.courses || []);
    } else {
      // User-created events are green (no courses are green, so doesn't clash)
      eventColor = "#408f31";
    }

    let style = {
      backgroundColor: eventColor,
    };

    return {
      style: style,
    }
  }

  // Find the actual event that was last clicked (used in rendering below)
  const lastClickedEvent = events.find(e => e._id === lastClicked);

  return (
    <div className={darkMode ? 'calendarWrapperDark' : ''}>
      <DragAndDrop
        popup={true}
        selectable={true}
        resizable={true}
        localizer={timeLocaliser}
        defaultDate={moment().toDate()}
        defaultView={props.limited ? "month" : "week"}
        views={props.limited ? ['month', 'agenda'] : ['month', 'week', 'day', 'agenda']}
        onSelectEvent={handleClickViewOpen}
        onSelectSlot={handleSelection}
        onEventDrop={dropEvent}
        events={events}
        style={{minHeight: props.size === 'small' ? '400px' : '85vh'}}
        eventPropGetter={eventStyleGetter}
        min={new Date(0, 0, 0, 8, 0, 0)}
        max={new Date(0, 0, 0, 20, 0, 0)}
        components={
          {
            eventWrapper: ({ event, children }) => (
              <div onContextMenu={(e: any) => handleEventRightClick(e, event)}>
                {children}
              </div>
            )
          }
        }
      />
      <Menu
        keepMounted
        open={eventMenu.mouseY !== null}
        onClose={handleClose}
        anchorReference="anchorPosition"
        anchorPosition={
          eventMenu.mouseY !== null && eventMenu.mouseX !== null
            ? { top: eventMenu.mouseY, left: eventMenu.mouseX }
            : undefined
        }
      >
        <MenuItem
          onClick={() => {
            handleClose();
            handleClickEditOpen();
          }}
        >Edit</MenuItem>
        <MenuItem
          onClick={() => {
            handleClose();
            handleDelete();
          }}
        >Delete</MenuItem>
      </Menu>
      <Dialog
        open={viewOpen}
        onClose={handleClickViewClose}
        scroll="paper"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>{
          lastClickedEvent?.type === EventType.AssessmentEvent
          ? lastClickedEvent?.courseCode + ': ' + lastClickedEvent?.title
          : lastClickedEvent?.title
        }</DialogTitle>
        <DialogContent dividers={true}>
          <DialogContentText style={{ whiteSpace: 'pre-wrap' }}>
            {events.find(e => e._id === lastClicked)?.desc}
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickViewClose}>
            Close
          </Button>
          { currentEvent.editable &&
          <Button
            variant="outlined"
            startIcon={<EditOutlinedIcon />}
            onClick={() => { handleClickViewClose(); handleClickEditOpen(); }}
          >
            Edit
          </Button>
          }
          { currentEvent.editable &&
          <Button
            variant="outlined"
            startIcon={<DeleteOutlinedIcon />}
            onClick={() => { handleClickViewClose(); handleDelete(); }}
          >
            Delete
          </Button>
          }
          { currentEvent.type === EventType.AssessmentEvent &&
          <Button
            component={Link}
            to={`/courses/${currentEvent.courseId}/`}
            onClick={handleClickViewClose}
            variant="outlined"
          >
            Go to Course
          </Button>
          }
        </DialogActions>
      </Dialog>
      <Dialog
        open={editOpen}
        onClose={handleClickEditClose}
        scroll="paper"
        maxWidth="sm"
        fullWidth={true}
      >
        <DialogTitle>{lastClicked === "" ? "Add Event" : "Edit Event"}</DialogTitle>
        <DialogContent dividers={true}>
          <Box>
            <TextField
              autoFocus
              fullWidth
              margin="dense"
              label="Event Title"
              type="text"
              value={currentEvent.title}
              onChange={handleChangeInputTitle}
              color="secondary"
            />
          </Box>
          <Box>
            <TextField
              fullWidth
              margin="dense"
              label="Event Description"
              type="text"
              value={currentEvent.desc}
              onChange={handleChangeInputDesc}
              color="secondary"
            />
          </Box>
          {lastClicked !== "" && /* Only show time controls when editing */
          <Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={allDay}
                  onChange={handleChangeInputAllDay}
                  name="allDay"
                />
              }
              label="All Day Event"
            />
            {allDay ? /* Show start/end times or only the day */
            <Box>
              <DatePicker
                label="Event Date"
                value={allDayDate}
                onChange={handleChangeInputAllDayDate}
                color="secondary"
              />
            </Box>
            :
            <Box>
              <DateTimePicker
                label="Starts At"
                value={currentEvent.start}
                onChange={handleChangeInputStart}
                color="secondary"
              />
              <DateTimePicker
                label="Ends At"
                value={currentEvent.end}
                onChange={handleChangeInputEnd}
                color="secondary"
                style={{ marginLeft: 16 }}
              />
            </Box>
            }
          </Box>
          }
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClickEditClose}>
            Cancel
          </Button>
          <Button
            variant="outlined"
            startIcon={<SaveOutlinedIcon />}
            onClick={() => { handleClickEditClose(); handleSubmit(); }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}

export default UserCalendar;
