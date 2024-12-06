/// <reference types="react" />
import './Checkbox.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * whether the box is checked
     */
    checked: boolean;
    /**
     * function to run when check state changes
     */
    onChange: (...args: any[]) => any;
    /**
     * value associated with checkbox
     */
    value: string;
    /**
     * Defines whether or not the checkboxes should look like radios
     */
    radioStyle?: boolean;
    /**
     * A boolean to determine if the checkbox is disabled
     */
    disabled?: boolean;
}
/**
 * A checkbox component
 */
export declare const Checkbox: (props: IProps) => JSX.Element;
export {};
