/// <reference types="react" />
import '../Input/Input.scss';
import './Select.scss';
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
     * object containing classNames
     */
    className?: {
        /**
         * className applied to container
         */
        container?: string;
        /**
         * className applied to actual input
         */
        input?: string;
    };
    /**
     * optional id for identifying html via selector
     */
    id?: string;
    /**
     * value for input
     */
    value: any;
    /**
     * array of options to display in the select
     */
    options: IReactSelectOption[];
    /**
     * error message
     */
    error?: string | undefined;
    /**
     * function to update value when it changes
     */
    onChange?: (...args: any[]) => any;
    /**
     * label to show with input
     */
    label?: string;
    /**
     * whether the input is disabled
     */
    disabled?: boolean;
    /**
     * whether to automatically focus on input when it appears
     */
    autoFocus?: boolean;
    /**
     * whether the input is required to proceed
     */
    required?: boolean;
    /**
     * whether the select should be searchable
     */
    search?: boolean;
    /**
     * whether to allow selection of multiple values
     */
    multi?: boolean;
    /**
     * function to run when input is blurred
     */
    onBlur?: (...args: any[]) => any;
    /**
     * placeholder for input
     */
    placeholder?: string;
}
/**
 * A select input
 */
export declare const Select: (props: IProps) => JSX.Element;
export {};
