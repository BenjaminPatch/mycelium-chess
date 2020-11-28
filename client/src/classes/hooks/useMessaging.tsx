import { MeetingSession, DataMessage } from "amazon-chime-sdk-js";
import { useEffect, useState, useCallback } from "react";
import { useAppState } from '../providers/AppStateProvider';

const useMessaging = (session: MeetingSession | null, topic: string) => {
  const [messages, setMessages] = useState<DataMessage[]>([]);
  const { setIsEngagementRequest } = useAppState();

  const prependMessage = useCallback(
    (dataMessage: DataMessage) => {
      if (dataMessage.text() === "engagement-request") {
        setIsEngagementRequest(true);
      } else {
        return setMessages((prevMessages) => [dataMessage, ...prevMessages])
      }
    },
    []
  );

  const clear = function() {
    setMessages([]);
  }

  useEffect(() => {
    session?.audioVideo.realtimeSubscribeToReceiveDataMessage(
      topic,
      prependMessage
    );
  }, [session, topic, prependMessage]);

  const sendMessage = useCallback(
    (text: string) => {
      if (
        session?.configuration.credentials?.attendeeId &&
        session?.configuration.credentials?.externalUserId
      ) {
        session.audioVideo.realtimeSendDataMessage(topic, text, 300000);

        prependMessage(
          new DataMessage(
            Date.now(),
            topic,
            new TextEncoder().encode(text),
            // localUserName,
            // localUserName
            session.configuration.credentials!.attendeeId!,
            session.configuration.credentials!.externalUserId!
          )
        );
      }
    },
    [session, topic, prependMessage]
  );

  return [messages, sendMessage, clear] as const;
};

export default useMessaging;