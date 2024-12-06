import * as React from 'react';
import './CustomToolbarSelect.scss';
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * any children that should be rendered inside of the sliding pane
     */
    children: React.ReactNode;
}
/**
 * A custom toolbar when items are selected for the table component
 */
export declare const CustomToolbarSelect: (props: IProps) => JSX.Element;
export {};
