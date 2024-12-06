/// <reference types="react" />
import './Radio.scss';
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
     * value associated with checkbox
     */
    value: string;
    /**
     * function to run when check state changes
     */
    onChange?: (...args: any[]) => any;
    /**
     * Determines whether the radio button is disabled
     */
    disabled?: boolean;
}
/**
 * A radio button
 */
export declare const Radio: (props: IProps) => JSX.Element;
export {};
