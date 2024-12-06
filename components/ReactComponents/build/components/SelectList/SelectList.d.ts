import * as React from 'react';
import './SelectList.scss';
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
     * which selection exist in the list
     */
    selections: {
        value: number;
        id: number;
        error?: string;
    }[];
    /**
     * what possible options to allow in selects
     */
    options: IReactSelectOption[];
    /**
     * function to update values in the list
     */
    updateRow: (index: number, value: any) => any;
    /**
     * function to add a new row
     */
    addRow: (...args: any[]) => any;
    /**
     * function to delete a row
     */
    deleteRow: (index: number) => any;
    /**
     * whether the select list is disabled and cannot be changed
     */
    disabled?: boolean;
}
/**
 * A list of select options
 */
export declare const SelectList: React.MemoExoticComponent<(props: IProps) => JSX.Element>;
export {};
