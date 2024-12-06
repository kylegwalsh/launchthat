import * as React from 'react';
import './IconCircle.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * icon to show in circle
     */
    icon: React.ReactNode;
    /**
     * color to set the background to
     */
    color: string;
}
/**
 * Component that includes an icon in a circle
 */
export declare const IconCircle: (props: IProps) => JSX.Element;
export {};
