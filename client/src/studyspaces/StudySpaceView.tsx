import React from "react";

import useSWR from 'swr';

import { StudySpace } from "../model";

import { RouteComponentProps } from "react-router-dom";

const fetcher = (url: any) => fetch(url).then(r => r.json())

function StudySpaceView({ match }: RouteComponentProps<any>) {
  const { data, error } = useSWR(`/api/studyspaces/${match.params.spaceId}`, fetcher);

  if (error || !data || !data.data) {
    return <div>Error/loading</div>; // TODO improve
  }

  let studySpace: StudySpace = data.data;

  return (
    <div style={{ color: studySpace.color }}>
      Study space code: {studySpace._id}
    </div>
  )
}

export default StudySpaceView;
