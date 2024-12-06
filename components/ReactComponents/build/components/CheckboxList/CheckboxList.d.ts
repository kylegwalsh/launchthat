import * as React from 'react';
import './CheckboxList.scss';
/**
 * Defines expected fields in each value
 */
interface IValues {
    /**
     * a value that determines whether the current box is checked
     */
    checked: boolean;
    /**
     * the value of the current box
     */
    value: string;
    /**
     * label for option
     */
    label: string;
    /**
     * an optional chip to render in the row
     */
    chip?: {
        /**
         * the type of chip
         */
        type: 'success' | 'warning' | 'danger' | 'default';
        /**
         * the text of the chip
         */
        label: string;
    };
    /**
     * an optional row to render with the item in the list
     */
    row?: React.ReactNode;
}
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * classNames to apply to different components
     */
    className?: {
        checkBox?: string;
        row?: string;
        formControl?: string;
    };
    /**
     * an array of value objects that handle the check boxes
     */
    values: IValues[];
    /**
     * the label given to the checkbox group
     */
    label?: string;
    /**
     * the function to run when the check boxes change
     */
    onChange: (event: any) => void;
    /**
     * determines whether the check boxes should be styled like radios
     */
    radioStyle?: boolean;
    /**
     * A boolean to determine whether or not the checkbox should be disabled
     */
    disabled?: boolean;
}
/**
 * A list of check boxes
 */
export declare const CheckboxList: (props: IProps) => JSX.Element;
export {};
