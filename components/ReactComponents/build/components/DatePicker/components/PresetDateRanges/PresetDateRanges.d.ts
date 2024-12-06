/// <reference types="react" />
import './PresetDateRanges.scss';
import * as moment from 'moment';
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
export declare const PresetDateRanges: (props: IProps) => JSX.Element;
export {};
