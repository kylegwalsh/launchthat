import * as React from 'react';
import './Input.scss';
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
     * error message
     */
    error?: string | undefined;
    /**
     * function to update value when it changes
     */
    onChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | undefined;
    /**
     * label to show with input
     */
    label?: string;
    /**
     * placeholder for input
     */
    placeholder?: string;
    /**
     * whether the input should be read only (no input changing)
     */
    readOnly?: boolean;
    /**
     * whether the input is disabled
     */
    disabled?: boolean;
    /**
     * maximum number of character
     */
    maxLength?: number;
    /**
     * whether to autocomplete the users input
     */
    autoComplete?: string;
    /**
     * whether to automatically focus on input when it appears
     */
    autoFocus?: boolean;
    /**
     * whether the input is required to proceed
     */
    required?: boolean;
    /**
     * type of input (email, etc)
     */
    type?: string;
    /**
     * info to display when hovering over info icon
     */
    info?: string;
    /**
     * function to run when input is blurred
     */
    onBlur?: (...args: any[]) => any;
}
/**
 * An input component
 */
export declare const Input: (props: IProps) => JSX.Element;
export {};
