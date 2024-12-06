/// <reference types="react" />
import 'react-dates/initialize';
import 'react-dates/lib/css/_datepicker.css';
import * as moment from 'moment';
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
}
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
export declare const DatePicker: (props: IProps) => JSX.Element;
export {};
