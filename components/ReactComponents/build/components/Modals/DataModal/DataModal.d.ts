import * as React from 'react';
import './DataModal.scss';
/**
 * Defines expected fields for each tab
 */
interface ITab {
    /**
     * the name of the tab
     */
    title: string;
    /**
     * component to render in the tab
     */
    body: React.ReactNode;
}
/**
 * Defines expected props for this component
 */
interface IProps {
    /**
     * className applied to component
     */
    className?: string;
    /**
     * text to display in modal header
     */
    headerText: string;
    /**
     * whether the modal is currently open
     */
    open: boolean;
    /**
     * function to run when modal is being closed
     */
    onClose: (...args: any[]) => any;
    /**
     * an array of objects that contain tab details (if there is only one tab only the body will be displayed)
     */
    tabs: ITab[];
    /**
     * whether the modal is loading data
     */
    loading: boolean;
    /**
     * which tab to show (index of array)
     */
    activeTab: number;
    /**
     * change active tab
     */
    setActiveTab?: (args0: number) => any;
}
/**
 * A modal meant for CRUD
 */
export declare const DataModal: (props: IProps) => JSX.Element;
export {};
