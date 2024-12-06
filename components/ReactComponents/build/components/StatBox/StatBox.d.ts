import * as React from 'react';
import './StatBox.scss';
/**
 * Defines expected props for this component
 */
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
         * className applied to inner content
         */
        content?: string;
    };
    /**
     * name of value
     */
    name: string;
    /**
     * number value to show
     */
    value: string | number;
    /**
     * icon to show
     */
    icon: React.ReactNode;
    /**
     * background color for icon
     */
    color: string;
}
/**
 * Component show cases a stat and icon for a category
 */
export declare const StatBox: (props: IProps) => JSX.Element;
export {};
