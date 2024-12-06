/// <reference types="react" />
import './RadioList.scss';
/**
 * Defines expected fields for each option
 */
interface IOption {
    /**
     * label to show for radio
     */
    label: string;
    /**
     * value of radio
     */
    value: string;
}
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * object of classNames applied to component
     */
    className?: {
        root?: string;
        radio?: string;
        radioGroup?: string;
        formControl?: string;
    };
    /**
     * The possible values of the radio button group
     */
    options: IOption[];
    /**
     * The current value selected in the radio button group
     */
    value?: string;
    /**
     * The label of the radio button group
     */
    label?: string;
    /**
     * A Function to handle the change of the radio button group
     */
    onChange: (event: any) => void;
    /**
     * Determines whether or not the radio list is disabled
     */
    disabled?: boolean;
}
/**
 * A list of radio buttons
 */
export declare const RadioList: (props: IProps) => JSX.Element;
export {};
