import * as React from 'react';
import './FieldMapRowDraggable.scss';
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
    options?: IReactSelectOption[];
    /**
     * optional id for the mapping
     */
    id: number;
    /**
     * the key of the mapping
     */
    target: string;
    /**
     * the value of the mapping
     */
    output: string;
    /**
     * whether to show the label
     */
    showLabel?: boolean;
    /**
     * optional field to disable inputs
     */
    disabled?: {
        /**
         * disable target field
         */
        target?: boolean;
        /**
         * disable output field
         */
        output?: boolean;
    };
    /**
     * whether to disable both fields
     */
    disableAll?: boolean;
    /**
     * An index for the current for loop looping through the values
     */
    index: number;
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
    errors?: {
        target?: string;
        output?: string;
    };
    /**
     * The category of the row
     */
    category: string;
    /**
     * Determines if the row is draggable
     */
    isDragDisabled: boolean;
    /**
     * A variable to check whether the category/column that this row
     * is in is being dragged over
     */
    draggingOver?: boolean;
    /**
     * Checks whether the ability to add in rows or delete them is added
     */
    disableAdditions?: boolean;
    /**
     * Determines whether or not the values should be automatically filled in the ouput
     */
    autofillOff?: boolean;
}
/**
 * A field map row component (used to map inputs to outputs)
 */
export declare const FieldMapRowDraggable: React.MemoExoticComponent<React.ForwardRefExoticComponent<IProps & React.RefAttributes<{}>>>;
export {};
