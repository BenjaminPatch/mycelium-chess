import React from "react";

import api from '../../../api';
import { authStore } from "../../../App";

import useMessaging from "../../hooks/useMessaging";
import { useMeetingManager } from "amazon-chime-sdk-component-library-react";
import { useStore } from "effector-react";
import moment from 'moment';

import {
  Button,
  List,
  ListItem,
  ListItemAvatar,
  Avatar,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  Divider,
  Typography,
} from "@material-ui/core";

import {
  InsertDriveFileOutlined,
  GetAppOutlined,
} from "@material-ui/icons";

interface Props {
  updateNumFiles: any;
}

function MeetingFiles(props: Props) {
  const manager = useMeetingManager();
  const [files, sendFile] = useMessaging(manager.meetingSession, "files");

  const auth = useStore(authStore);

  const fileInputRef = React.createRef<HTMLInputElement>();

  const handleShareFile = async (event: any) => {
    let formData = new FormData();

    if (fileInputRef!.current!.files!.length === 0) {
      return;
    }

    formData.append('file', fileInputRef!.current!.files![0]);
    formData.append('filename', fileInputRef!.current!.files![0].name);
    formData.append('mimetype', fileInputRef!.current!.files![0].type || 'application/octet-stream');

    await api.insertFile(formData).then((res: any) => {
      const fileId = res.data.id || '';
      sendFile(JSON.stringify({
        id: fileId,
        name: fileInputRef!.current!.files![0].name,
      }));
    });
  }

  props.updateNumFiles(files.length);

  const fileObjects = files.map((file: any) => JSON.parse(file.text()));

  return (
    <div>
      {auth.userType === 'staff' &&
      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        <input
          type="file"
          ref={fileInputRef}
          style={{ width: '100%', padding: '1em' }}
        />
        <Button
          variant="contained"
          onClick={handleShareFile}
          style={{ marginBottom: '1em' }}
        >
          Share File
        </Button>
      </div>
      }
      <div>
        <List>
          {auth.userType === 'staff' && <Divider />}
          {fileObjects.map((file: any, i: number) => (
            <ListItem key={"file" + i} divider={i < fileObjects.length - 1}>
              <ListItemAvatar>
                <Avatar>
                  <InsertDriveFileOutlined />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={file.name}
                secondary={moment(file.timestampMs).format("h:mm:ss a")}
              />
              <ListItemSecondaryAction>
                <IconButton href={`/api/files/${file.id}/download`} edge="end" aria-label="download">
                  <GetAppOutlined />
                </IconButton>
              </ListItemSecondaryAction>
            </ListItem>
          ))}
          {fileObjects.length === 0 &&
            <Typography
              variant="body2"
              color="textSecondary"
              align="center"
              style={{ paddingTop: '1em' }}
            >
              No files
            </Typography>
          }
        </List>
      </div>
    </div>
  );
}

export default MeetingFiles;