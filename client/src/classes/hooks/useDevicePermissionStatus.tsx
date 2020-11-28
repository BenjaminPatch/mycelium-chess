import { useEffect, useState } from 'react';
import { useMeetingManager } from 'amazon-chime-sdk-component-library-react';

import { DevicePermissionStatus } from 'amazon-chime-sdk-component-library-react/lib/providers/MeetingProvider/types';

export default function useDevicePermissionStatus() {
  const meetingManager = useMeetingManager();
  const [permission, setPermission] = useState<string>(
    DevicePermissionStatus.UNSET
  );

  useEffect(() => {
    const callback = (updatedPermission: string): void => {
      setPermission(updatedPermission);
    };
    meetingManager.subscribeToDevicePermissionStatus(callback);
    return () => {
      meetingManager.unsubscribeFromDevicePermissionStatus(callback);
    };
  }, [meetingManager]);

  return permission;
}
