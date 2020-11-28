import React from 'react';

import {
  HelpTwoTone,
  SentimentSatisfiedTwoTone,
  SentimentDissatisfiedTwoTone,
  SentimentVeryDissatisfiedTwoTone,
  EmojiObjectsTwoTone,
  BlockTwoTone,
} from '@material-ui/icons';

const emotions = [
  {
    name: 'Happy',
    icon: <SentimentSatisfiedTwoTone color='secondary' />,
  },
  {
    name: 'Thinking',
    icon: <EmojiObjectsTwoTone color='secondary' />,
  },
  {
    name: 'Fell behind',
    icon: <SentimentDissatisfiedTwoTone color='secondary' />,
  },
  {
    name: 'Confused',
    icon: <SentimentVeryDissatisfiedTwoTone color='secondary' />,
  },
  {
    name: 'Unsure',
    icon: <HelpTwoTone color='secondary' />,
  },
];

export function getEmotions() {
  return emotions;
}

export function getEmotionIcon(emotionName: string) {
  const foundEmotions = emotions.filter(e => e.name === emotionName);
  if (foundEmotions.length === 0) {
    return <BlockTwoTone />;
  }
  return foundEmotions[0].icon;
}

export function getCourseColor(code: string, codes: any) {
  const colors = ['#EB602B', '#FBB800', '#4085C6', '#00A2C7', '#999490'];
  codes.sort();
  const pos = codes.indexOf(code);
  return colors[pos % colors.length];
};

export function getReadableDateStamp(date: Date) {
  const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "June",
    "July", "Aug", "Sep", "Oct", "Nov", "Dec"];

  let month = monthNames[date.getMonth()];
  let day = String(date.getDate()).padStart(2, '0');

  return day + " " + month;
}

export function getReadableTimeStamp(date: Date) {
  var hours = date.getHours();
  var minutes = date.getMinutes();
  var ampm = hours >= 12 ? 'pm' : 'am';

  hours = hours % 12;
  hours = hours ? hours : 12; // the hour '0' should be '12'
  var formattedMinutes = minutes < 10 ? '0' + minutes : minutes;

  return hours + ':' + formattedMinutes + ' ' + ampm;

}
