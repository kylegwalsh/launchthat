/// <reference types="react" />
import './OperationButtons.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * function to be used for view operation
     */
    view?: (...args: any[]) => void;
    /**
     * function to be used for edit operation
     */
    edit?: (...args: any[]) => void;
    /**
     * function to be used for delete operation
     */
    delete?: (...args: any[]) => void;
}
/**
 * Includes a list of generic buttons for table operations
 */
export declare const OperationButtons: (props: IProps) => JSX.Element;
export {};
