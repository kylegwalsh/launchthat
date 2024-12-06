import * as React from 'react';
const { useState } = React;
// tslint:disable-next-line: no-submodule-imports
import 'react-dates/initialize';
// tslint:disable-next-line: no-submodule-imports
import 'react-dates/lib/css/_datepicker.css';
import { DateRangePicker } from 'react-dates';
import * as moment from 'moment';
import { PresetDateRanges } from './components/PresetDateRanges/PresetDateRanges';
import './DatePicker.scss';

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
   * an optional id string for the start date
   */
  startDateId?: string;
  /**
   * an optional id string for the end date
   */
  endDateId?: string;
  /**
   * Preset date ranges option
   */
  presetRanges?: boolean;
  /**
   * Custom options for the preset date range picker
   */
  presets?: IPresets[];
  /**
   * Clear date
   */
  showClearDates?: boolean;
}

/**
 * A generic date picker component
 */
export const DatePicker = (props: IProps) => {
  const [focusedInput, setFocusedInput] = useState(null);
  /**
   * Set focused input when focused
   * @param focus 
   */
  const onFocusChange = (focus: any) => {
    setFocusedInput(focus);
  };

  const renderPresets = () => {
    return(
      <PresetDateRanges 
        setFocusedInput={setFocusedInput} 
        startDate={props.startDate} 
        endDate={props.endDate} 
        onDatesChange={props.onDatesChange}
      />
    );
  };

  return (
    <DateRangePicker 
      {...props}
      noBorder
      showClearDates={props.showClearDates}
      renderCalendarInfo={renderPresets}
      minimumNights={0}
      focusedInput={focusedInput}
      startDate={props.startDate}
      isOutsideRange={day => (moment.utc().diff(day) < 0) || moment.utc().isSame(day, 'day')}
      startDateId={ props.startDateId ? props.startDateId : 'start-date' }
      endDateId={ props.endDateId ? props.endDateId : 'end-date' }
      endDate={props.endDate}
      onDatesChange={({ startDate, endDate }) => props.onDatesChange(startDate, endDate)}
      onFocusChange={onFocusChange}
    />
  );
};