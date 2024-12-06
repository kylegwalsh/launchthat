/// <reference types="react" />
import './Label.scss';
interface IProps {
    /**
     * classNames to apply to component
     */
    className?: string;
    /**
     * value for input
     */
    text: string;
    /**
     * value for if the label should be required
     */
    required?: boolean;
}
export declare const Label: (props: IProps) => JSX.Element;
export {};
