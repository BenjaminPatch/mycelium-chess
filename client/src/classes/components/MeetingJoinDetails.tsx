import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import {
  PrimaryButton,
  Flex,
  Label,
  useMeetingManager,
  Modal,
  ModalBody,
  ModalHeader,
  useAudioInputs,
  useAudioOutputs
} from 'amazon-chime-sdk-component-library-react';

import Card from './Card';
import { useAppState } from '../providers/AppStateProvider';
import { Button } from '@material-ui/core';

const MeetingJoinDetails = () => {
  const meetingManager = useMeetingManager();
  const history = useHistory();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { meetingId, localUserName } = useAppState();

  const handleJoinMeeting = async () => {
    setIsLoading(true);

    try {
      await meetingManager.start();
      setIsLoading(false);
      history.push(`/meeting/${meetingId}`);
    } catch (error) {
      setIsLoading(false);
      setError(error.message);
    }
  };

  let { devices: micDevices } = useAudioInputs();
  let { devices: speakerDevices } = useAudioOutputs();
  const areMics = () => {
    return micDevices.length > 0 || speakerDevices.length > 0;
  }

  return (
    <>
      <Flex container alignItems="center" flexDirection="column" >
        {areMics() ?
          <Button variant="contained" color="secondary" disableElevation
            onClick={handleJoinMeeting}>
                {isLoading ? 'Loading...' : 'Join meeting'}
          </Button> : 
          <Button variant="contained" color="primary" disableElevation disabled> 
            Waiting for devices
          </Button>
        }
      </Flex>
      {error && (
        <Modal size="md" onClose={(): void => setError('')}>
          <ModalHeader title={`Meeting ID: ${meetingId}`} />
          <ModalBody>
            <Card
              title="Unable to join meeting"
              description="There was an issue in joining this meeting. Check your connectivity and try again."
              smallText={error}
            />
          </ModalBody>
        </Modal>
      )}
    </>
  );
};

export default MeetingJoinDetails;
