import React from 'react';

class MeetingOver extends React.Component {

  render() {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (global as any).app = this;
    return (

        <h1>Meeting has been ended</h1>

    );
  }
}

export default MeetingOver;
