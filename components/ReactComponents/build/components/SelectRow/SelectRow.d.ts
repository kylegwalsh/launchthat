import * as React from 'react';
import './SelectRow.scss';
/**
 * Defines expected props for options
 */
interface IOption {
    /**
     * visible value for option
     */
    label: string;
    /**
     * actual value for option
     */
    value?: any;
}
/**
 * Defines expected props for ReactSelect options
 */
interface IReactSelectOption {
    /**
     * visible value for option
     */
    label: string;
    /**
     * actual value for option
     */
    value?: any;
    /**
     * nested options
     */
    options?: IOption[];
}
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * what possible options to allow as the targets (usually array of approved fields).
     * If not specified, the target will be a normal input
     */
    options: IReactSelectOption[];
    /**
     * optional id for the mapping
     */
    id?: number;
    /**
     * value selected
     */
    value: string;
    /**
     * optional field to select
     */
    disabled?: boolean;
    /**
     * function to handle changes
     */
    onChange?: (...args: any[]) => any;
    /**
     * function used to delete the row
     */
    deleteRow?: (...args: any[]) => any;
    /**
     * function used to add a new row
     */
    addRow?: (...args: any[]) => any;
    /**
     * object containing target and output errors
     */
    error?: string;
}
/**
 * A select row component (used to make selections in a list)
 */
export declare const SelectRow: React.NamedExoticComponent<IProps>;
export {};
