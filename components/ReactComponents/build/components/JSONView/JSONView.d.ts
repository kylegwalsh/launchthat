/// <reference types="react" />
import './JSONView.scss';
import '../Input/Input.scss';
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
     * the JSON data that you want to display
     */
    data: any;
    /**
     * a boolean to determine if you want to display the data types
     */
    displayDataTypes?: boolean;
    /**
     * the name of the root element or false if you don't want one
     */
    name?: string | false | null | undefined;
    /**
     * adds the ability to remove the collapsible ability for the root element
     */
    collapsibleRoot?: boolean;
    /**
     * adds the ability to disable the JSON Field
     */
    disabled: boolean;
    /**
     * label to show with input
     */
    label?: string;
    /**
     * whether the input is required to proceed
     */
    required?: boolean;
}
/**
 * A component to display JSON data in a nice format
 */
export declare const JSONView: (props: IProps) => JSX.Element;
export {};
