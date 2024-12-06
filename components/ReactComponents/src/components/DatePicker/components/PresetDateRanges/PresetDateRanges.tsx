import * as React from 'react';
import './PresetDateRanges.scss';
import * as moment from 'moment';
import { Select } from '../../../';

interface IPresets {
  /**
   * The name of the date preset
   */
  text: string;
  /**
   * The start date of the preset
   */
  startDate: moment.Moment;
  /**
   * The end date of the date presets
   */
  endDate: moment.Moment;
};

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * the start date for the date picker
   */
  startDate: moment.Moment | null;
  /**
   * the end date for the date picker
   */
  endDate: moment.Moment | null;
  /**
   * a callback that sets the state of the dates
   */
  onDatesChange: (startDate: moment.Moment | null, endDate: moment.Moment | null) => void;
  /**
   * Optional presets provided to the date ranges for custom preset dates
   */
  presets?: any;
  /**
   * Focuses the map
   */
  setFocusedInput: (...args: any) => void;
}

const today = moment.utc().subtract(1, 'days');

const defaultDateRanges: IPresets[] = [
  {
    text: 'Last Week',
    startDate: moment.utc().subtract(1, 'weeks').startOf('week'),
    endDate: moment.utc().subtract(1, 'weeks').endOf('week'),
  },
  {
    text: 'Last Month',
    startDate: moment.utc().subtract(1, 'months').startOf('months'),
    endDate: moment.utc().subtract(1, 'months').endOf('month'),
  },
  {
    text: 'This Month',
    startDate: moment.utc().startOf('month'),
    endDate: today,
  },
  {
    text: 'Past 7 Days',
    startDate: moment.utc().subtract(8, 'days'),
    endDate: today,
  },
  {
    text: 'Past 30 Days',
    startDate: moment.utc().subtract(31, 'days'),
    endDate: today,
  },
  {
    text: 'Past 60 Days',
    startDate: moment.utc().subtract(61, 'days'),
    endDate: today,
  },
  {
    text: 'Past 90 Days',
    startDate: moment.utc().subtract(91, 'days'),
    endDate: today,
  },
  {
    text: 'This Year',
    startDate: moment.utc().startOf('year'),
    endDate: today,
  },
  {
    text: 'All-time',
    startDate: moment.utc('2017-01-01'),
    endDate: today,
  },
];

// const setFocus = (rangeText: string) => {
//   switch (rangeText) {
//   case 'Last Week':
//     return 'endDate';
//   case 'Last Month':
//     return 'endDate';
//   case 'This Month':
//     return 'endDate';
//   case 'Past 7 Days':
//     return 'endDate';
//   case 'Past 30 Days':
//     return 'endDate';
//   default:
//     return 'startDate';
//   }
// };

export const PresetDateRanges = (props: IProps) => {
  const dateRanges = props.presets ? props.presets : defaultDateRanges;
  const options = dateRanges.map((a: any) => ({ value: a.text, label: a.text }));

  const onSelect = (value: string) => {
    for (const range of dateRanges) {
      if (value === range.text) {
        props.onDatesChange(range.startDate, range.endDate);
        const focus = 'startDate';
        props.setFocusedInput(focus);
      }
    }
  };

  const getValue = () => {
    for (const range of dateRanges) {
      if (moment.utc(range.startDate).isSame(props.startDate === null ? undefined : props.startDate, 'day')
      && moment.utc(range.endDate).isSame(props.endDate === null ? undefined : props.endDate, 'day')) return range.text;
    }
  };

  return (
  <div className={`presetDateRangePicker__panel`}>
      <Select 
        onChange={onSelect} 
        placeholder={'Select a date: '} 
        className={{ container: 'presetDateRangePicker__select' }} 
        value={getValue()} 
        options={options} 
      />
    </div>
  );
};