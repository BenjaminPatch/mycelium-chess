import React, { useContext, useState, ReactNode, useEffect} from 'react';
import { DeviceSetup } from './';
import { useAppState } from '../providers/AppStateProvider';
import { fetchMeeting, createGetAttendeeCallback } from '../utils/api';
import {
  useMeetingManager,
} from 'amazon-chime-sdk-component-library-react';
import { currentTitleStoreApi } from '../../App';
import useSWR from 'swr';

const DEFAULT_AU_REGION = 'ap-southeast-2';
  
type Props = {
    meetingId: string,
    attendeeName: string,
    isStaff: boolean
}

function MeetingJoiner(props: Props) {
  const meetingManager = useMeetingManager();
  const {
    setAppMeetingInfo,
    region: appRegion,
    meetingId: appMeetingId
  } = useAppState();
  
  const id = props.meetingId.trim().toLocaleLowerCase();
  const attendeeName = props.attendeeName.trim();
  const [meetingId, setMeeting] = useState(props.meetingId || '');
  const [meetingErr, setMeetingErr] = useState(false);
  const [nameErr, setNameErr] = useState(false);
  const [localUserName, setLocalUserName] = useState(props.attendeeName || '');
  const [isStaff, setisStaff] = useState(props.isStaff);
  const [region, setRegion] = useState(DEFAULT_AU_REGION);
  const [rendered, setRendered] = useState(false);
  const [calledUseEffect, setCalledUseEffect] = useState(false);

  if (!attendeeName) {
    setNameErr(true);
  }

  if (!id) {
    setMeetingErr(true);
  }

  const errorCheck = async () => {
    const id = meetingId.trim().toLocaleLowerCase();
    const attendeeName = localUserName.trim();

    if (!id || !attendeeName) {
      if (!attendeeName) {
        setNameErr(true);
      }

      if (!id) {
        setMeetingErr(true);
      }
    }
  }
  const query = `/api/meetings/${meetingId}`;

  const fetcher = (url: any) => fetch(url).then(r => r.json());
  const { data, error, mutate } = useSWR(query, fetcher);
  var meetingName = "OnBoard Meeting";
  if (data) {
    meetingName = data.data.name;
  }

  useEffect(() => {
    currentTitleStoreApi.setTitle(meetingName);
    if (!rendered) {
      setRendered(true);
      return;
    }
    if (calledUseEffect) {
      return;
    }
    async function temp() {
      setAppMeetingInfo(meetingId, localUserName, region);
      errorCheck();
      const { JoinInfo } = await fetchMeeting(id, attendeeName, region);
      meetingManager.getAttendee = createGetAttendeeCallback(id);
      await meetingManager.join({
        meetingInfo: JoinInfo.Meeting,
        attendeeInfo: JoinInfo.Attendee
      });
    }
    temp();

    setCalledUseEffect(true);
  });

  return (
    <>
    { 
        meetingErr ? <h1>Trying to join meeting with invalid ID</h1> : 
        <div> {null} </div>
    }
    { 
        nameErr ? <h1>Trying to join meeting using an invalid name</h1> : 
        <div> {null} </div>
    }
    {
        meetingErr || nameErr ? <> </> :
        <DeviceSetup />
    }
    </>
  );
}

export default MeetingJoiner;
