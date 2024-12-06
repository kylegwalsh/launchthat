import * as React from 'react';
import './FieldMapColumn.scss';
interface IProps {
    category: string;
    index: number;
    children: React.ReactChild;
    /**
     * function used to add a new row
     */
    addCategory?: (...args: any[]) => any;
    /**
     * Function used to add a new category
     */
    deleteCategory?: (...args: any[]) => any;
    /**
     * Determines if the column is draggable or not
     */
    isDragDisabled: boolean;
    /**
     * The id of the category
     */
    id: number;
    /**
     * An error object that contains the proper error messages to be displayed
     */
    error?: string;
    /**
     * Labels
     */
    labels?: {
        target: string;
        output: string;
    };
    /**
     * whether the field map is disabled
     */
    disabled?: boolean;
    /**
     * Check whether to disable addtions or deletions
     */
    disabledAdditions?: boolean;
}
export declare const FieldMapColumn: React.MemoExoticComponent<React.ForwardRefExoticComponent<IProps & React.RefAttributes<{}>>>;
export {};
