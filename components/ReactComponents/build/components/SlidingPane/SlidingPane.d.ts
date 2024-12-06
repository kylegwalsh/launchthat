import * as React from 'react';
import 'react-slide-out/lib/index.css';
import './SlidingPane.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to pane
     */
    className?: string;
    /**
     * title to display at the top of the pane
     */
    title?: string;
    /**
     * whether the sliding pane is currently open
     */
    isOpen: boolean;
    /**
     * function that allows the sliding pane to close itself (uses setIsOpen(false))
     */
    setIsOpen: (arg0: boolean) => void;
    /**
     * any children that should be rendered inside of the sliding pane
     */
    children?: React.ReactNode;
}
/**
 * A pane that slides out from different sides
 */
export declare const SlidingPane: (props: IProps) => JSX.Element;
export {};
