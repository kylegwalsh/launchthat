/// <reference types="react" />
import './BugFooter.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
}
/**
 * A footer that contains a link to report any bugs via Google Form
 */
export declare const BugFooter: (props: IProps) => JSX.Element;
export {};
