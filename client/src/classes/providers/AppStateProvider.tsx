import React, { useContext, useState, ReactNode } from 'react';

type Props = {
  children: ReactNode;
};

interface AppStateValue {
  meetingId: string;
  localUserName: string;
  theme: string;
  region: string;
  toggleTheme: () => void;
  setAppMeetingInfo: (meetingId: string, name: string, region: string) => void;
  isStaff: boolean;
  setIsStaff: (arg0: boolean) => void;
  isEngagementResponse: boolean;
  setIsEngagementResponse: (arg0: boolean) => void;
  isEngagementRequest: boolean;
  setIsEngagementRequest: (arg0: boolean) => void;
}

const AppStateContext = React.createContext<AppStateValue | null>(null);

export function useAppState(): AppStateValue {
  const state = useContext(AppStateContext);

  if (!state) {
    throw new Error('useAppState must be used within AppStateProvider');
  }

  return state;
}

const query = new URLSearchParams(window.location.search);

export function AppStateProvider({ children }: Props) {
  const [meetingId, setMeeting] = useState(query.get('meetingId') || '');
  const [region, setRegion] = useState(query.get('region') || '');
  const [localUserName, setLocalName] = useState('');
  const [theme, setTheme] = useState(() => {
    const storedTheme = localStorage.getItem('theme');
    return storedTheme || 'light';
  });
  const [isStaff, setIsStaff] = useState(false);
  const [isEngagementRequest, setIsEngagementRequest] = useState(false);
  const [isEngagementResponse, setIsEngagementResponse] = useState(false);

  const toggleTheme = (): void => {
    if (theme === 'light') {
      setTheme('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      setTheme('light');
      localStorage.setItem('theme', 'light');
    }
  };

  const setAppMeetingInfo = (
    meetingId: string,
    name: string,
    region: string
  ) => {
    setRegion(region);
    setMeeting(meetingId);
    setLocalName(name);
  };

  const providerValue = {
    meetingId,
    localUserName,
    theme,
    region,
    toggleTheme,
    setAppMeetingInfo,
    isStaff,
    setIsStaff,
    isEngagementResponse,
    setIsEngagementResponse,
    isEngagementRequest,
    setIsEngagementRequest
  };

  return (
    <AppStateContext.Provider value={providerValue}>
      {children}
    </AppStateContext.Provider>
  );
}
