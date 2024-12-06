import * as React from 'react';
declare const PureComponent: typeof React.PureComponent;
export { PureComponent };
import './FieldMapList.scss';
import { DropResult } from 'react-beautiful-dnd';
/**
 * Defines expected props for options
 */
interface IOption {
    /**
     * visible value for option
     */
    label: string;
    /**
     * actual value for option
     */
    value?: any;
}
/**
 * Defines expected props for ReactSelect options
 */
interface IReactSelectOption {
    /**
     * visible value for option
     */
    label: string;
    /**
     * actual value for option
     */
    value?: any;
    /**
     * nested options
     */
    options?: IOption[];
}
/**
 * Properties required for field map object
 */
interface IFieldMap {
    /**
     * value to search for and replace with output
     */
    id: number;
    /**
     * value to search for and replace with output
     */
    target: string;
    /**
     * value to map input to
     */
    output: string;
    /**
     * optional field to disable inputs
     */
    disabled?: {
        /**
         * disable target field
         */
        target?: boolean;
        /**
         * disable output field
         */
        output?: boolean;
    };
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
     * what possible options to allow as the targets (usually array of approved fields)
     */
    options?: IReactSelectOption[];
    /**
     * whether field map should allow for a nested categories / draggable version of the field map
     */
    useCategories?: boolean;
    /**
     * errors for each input
     */
    errors?: any;
    /**
     * Labels for the categories
     */
    labels?: {
        target: string;
        output: string;
    };
    /**
     * whether a user can edit a field map
     */
    disabled?: boolean;
    /**
     * Whether a user can add or remove items from the fieldmap
     */
    disableAdditions?: boolean;
    /**
     * Determines whether or not the values should be automatically filled in the ouput
     */
    autofillOff?: boolean;
}
/**
 * A list of field map rows
 */
export declare class FieldMapList extends PureComponent<IProps> {
    state: {
        fieldMap: IFieldMap[];
        refs: any;
        count: number;
        options: IReactSelectOption[] | undefined;
    };
    /**
     * Function used by parent to init the field map in this component
     */
    initFieldMap: (initialFieldMap: IFieldMap[]) => void;
    /**
     * @param result - The result object of the drag and drop
     */
    onDragEnd: (result: DropResult) => void;
    /**
     * @param fieldMap - The fieldMap/refs we want to reorder
     * @param source - The source object from the react beautiful dnd
     * @param destination - The destination object from the react beautiful dnd
     * @param refs - A boolean to determine if we are operating on refs
     */
    reorderFieldMap: (fieldMap: any, source: any, destination: any, refs?: boolean | undefined) => any;
    /**
     * @param list - a list to reorder
     * @param startIndex - the index where the element is coming from
     * @param endIndex -  the index where the element should end
     */
    reorder: (list: any[], startIndex: number, endIndex: number) => any[];
    /**
     * Retrieve all values for parent
     */
    retrieveFieldMap: () => any[];
    /**
     * Generate field map rows
     */
    generateRows: () => JSX.Element | JSX.Element[] | undefined;
    /**
     * Add a category to the field map
     */
    addCategory: () => void;
    /**
     * A function that is used to remove a category
     * @param index - the index of the category that needs to be deleted
     */
    deleteCategory: (index: number) => void;
    /**
     * Function used to delete a row of data in the field map
     * @param index - which row to delete
     * @param category - The category which the row should be deleted from
     */
    deleteRow: (index: number, category?: string | undefined) => void;
    /**
     * Add a row to either a category or just the field map if your not using categories
     * @param category - The category which the row should be added to
     */
    addRow: (category?: string | undefined) => void;
    render(): JSX.Element;
}
