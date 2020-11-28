import React, { ChangeEvent } from 'react';
import { DeviceType, SelectedDeviceId } from '../types/index';

import {
  FormControl,
  makeStyles,
  MenuItem,
  Select,
} from "@material-ui/core";

interface Props {
  label: string;
  notFoundMsg: string;
  devices: DeviceType[];
  selectedDeviceId: SelectedDeviceId;
  onChange: (deviceId: string) => void;
}

const DeviceInput: React.FC<Props> = ({
  onChange,
  label,
  devices,
  selectedDeviceId,
  notFoundMsg
}) => {

  const useStyles = makeStyles((theme) => ({
    formControl: {
      fullWidth: true,
      display: "flex",
      wrap: "nowrap"
    },

    selectEmpty: {
      marginTop: theme.spacing(3),
    },
  }));

  const classes = useStyles();

  const [device, setDevice] = React.useState('');

  const handleChange = (event: any) => {
    // event handler for when user selects device. 

    setDevice(event.target.value);
    
    const deviceId = event.target.value;

    if (deviceId === 'not-available') {
      return;
    }

    onChange(deviceId);
  };

  const outputOptions = devices.map(device => ({
    value: device.deviceId,
    label: device.label
  }));

  const options = outputOptions.length
    ? outputOptions
    : [
      {
        value: 'not-available',
        label: notFoundMsg
      }
    ];

  return (
    <FormControl variant="outlined" fullWidth={true}>
      <Select
        labelId={label}
        id={label}
        value={options.length >= 1 ? options[0].value : 'not-available'}
        onChange={handleChange}
        displayEmpty
        className={classes.selectEmpty}
        fullWidth={true}
      >

        {
        options.map((device, i) => (
            <MenuItem value={device.value}>{device.label}</MenuItem>
          ))
        }

      </Select>
    </FormControl>
  );
};

export default DeviceInput;