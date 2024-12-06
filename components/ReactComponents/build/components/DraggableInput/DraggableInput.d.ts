/// <reference types="react" />
import './DraggableInput.scss';
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
}
export declare const DraggableInput: (props: IProps) => JSX.Element;
export {};
