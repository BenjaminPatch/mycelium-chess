import React from "react";

import { StudySpace } from "../model";
import ShareStudySpace from "./ShareStudySpace";
import EditStudySpace from "./EditStudySpace";
import DeleteStudySpace from "./DeleteStudySpace";
import LeaveStudySpace from "./LeaveStudySpace";
import { authStore } from "../App";

import { useStore } from "effector-react";
import { Link } from 'react-router-dom';

import {
  List,
  ListItem,
  Grid,
  Divider,
  Button,
  Typography,
  Chip,
} from "@material-ui/core";

import {
  ArrowForward,
  Face,
} from "@material-ui/icons";

interface Props {
  studySpaces: StudySpace[];
  mutate: any;
}

// Maximum number of study space members to display, excluding owner
const numMembersToDisplay = 8;

function StudySpacesList(props: Props) {
  const auth = useStore(authStore);

  if (props.studySpaces.length > 0) {
    return (
      <List>
        <Divider />
        {props.studySpaces.map((space, index) => (
          <ListItem
            divider
            key={space._id}
          >
            <Grid container alignItems="center">
              <Grid item container spacing={1} direction="column" xs={8}>
                <Grid item>
                  <Typography variant="h6">
                    {space.name}
                  </Typography>
                </Grid>
                <Grid item container spacing={1}>
                  <Grid item>
                    <Chip
                      variant="outlined"
                      size="small"
                      color="secondary"
                      icon={<Face />}
                      label={space.owner}
                    />
                  </Grid>
                  {space.members.slice(0, numMembersToDisplay).map((member: string) => (
                    <Grid item>
                      <Chip
                        variant="outlined"
                        size="small"
                        icon={<Face />}
                        label={member}
                      />
                    </Grid>
                  ))}
                  {space.members.length > numMembersToDisplay &&
                    <Grid item>
                      <Chip
                        variant="outlined"
                        size="small"
                        label={`${space.members.length - numMembersToDisplay} more`}
                      />
                    </Grid>
                  }
                </Grid>
              </Grid>
              <Grid item container alignItems="center" justify="flex-end" spacing={1} xs={4}>
                {space.isPublic &&
                <ShareStudySpace studySpace={space} />
                }
                {space.owner === auth.username &&
                <EditStudySpace studySpace={space} mutate={props.mutate} />
                }
                {space.owner === auth.username &&
                <DeleteStudySpace studySpace={space} mutate={props.mutate} />
                }
                {space.members.includes(auth.username) &&
                <LeaveStudySpace studySpace={space} mutate={props.mutate} />
                }
                <Grid item>
                  <Button
                    variant="contained"
                    endIcon={<ArrowForward />}
                    color="secondary"
                    component={Link}
                    to={`/meeting/join?id=${space._id}`}
                  >
                    Enter
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </ListItem>
        ))}
      </List>
    );
  } else {
    return (
      <Grid container justify="space-around" alignItems="center">
        <Grid item>
          <Typography variant="body2" color="textSecondary">
            No study spaces. Why not create one?
          </Typography>
        </Grid>
      </Grid>
    );
  }
}

export default StudySpacesList;

