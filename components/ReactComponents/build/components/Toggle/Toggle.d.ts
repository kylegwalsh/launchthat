/// <reference types="react" />
import './Toggle.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * the current status of the toggle
     */
    value: boolean;
    /**
     * function to run when toggle is clicked
     */
    onClick?: (...args: any[]) => any;
    /**
     * label to show over the toggle (like an input label)
     */
    label?: string;
    /**
     * whether the toggle is disabled
     */
    disabled?: boolean;
}
/**
 * A toggle component to change the active status of something
 */
export declare const Toggle: (props: IProps) => JSX.Element;
export {};
