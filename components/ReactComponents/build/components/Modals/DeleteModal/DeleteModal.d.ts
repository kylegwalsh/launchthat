/// <reference types="react" />
import './DeleteModal.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * whether the modal is currently open
     */
    open: boolean;
    /**
     * function to run when modal is being closed
     */
    onClose: (...args: any[]) => any;
    /**
     * function to run once deletion is confirmed
     */
    delete: (...args: any[]) => any;
    /**
     * Determine if the modal should be loading
     */
    loading?: boolean;
    /**
     * Items that are pending deletion and thus the delete action can't be performed
     */
    pendingDeletes?: {
        /**
         * Variable Id key name use to specify that category of the object in the pending deletions
         */
        [key: string]: {
            name: string;
            link?: string;
        }[];
    }[];
    /**
     * Text used for specifying what needs to be removed for pending deletions
     */
    pendingDeleteText?: string;
    pendingDeleteInternalLink?: boolean;
    /**
     * The name of the item that's being deleted (Used delete stopper + used in the name)
     */
    deleteName?: string;
}
/**
 * A modal meant for confirmation of deletions
 */
export declare const DeleteModal: (props: IProps) => JSX.Element;
export {};
