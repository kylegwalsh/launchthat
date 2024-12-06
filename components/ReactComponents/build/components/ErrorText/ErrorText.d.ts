/// <reference types="react" />
import './ErrorText.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * text to show in error
     */
    text: string;
}
/**
 * Red text used to denote errors
 */
export declare const ErrorText: (props: IProps) => JSX.Element;
export {};
