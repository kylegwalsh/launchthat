/// <reference types="react" />
import './Loading.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * size loading gif should be
     */
    size?: 'large' | 'med' | 'small';
}
/**
 * A component that displays a full size spinner
 */
export declare const Loading: (props: IProps) => JSX.Element;
export {};
