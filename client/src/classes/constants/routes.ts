const awsPath = '/Prod';
export const rootPath: string = window.location.href.includes(awsPath)
  ? `${awsPath}/`
  : '/';

const routesChime = {
  HOME: `${rootPath}`,
  DEVICE: `${rootPath}/devices`,
  MEETING: `${rootPath}/meeting`,
  MEETING_OVER: "/meeting-over"
};

export default routesChime;
