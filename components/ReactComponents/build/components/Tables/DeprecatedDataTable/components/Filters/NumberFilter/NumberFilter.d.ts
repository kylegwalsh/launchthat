/// <reference types="react" />
import './NumberFilter.scss';
interface IProps {
    /**
     * A function for used for closing the current filter when the user either clears the filters, or
     * applies the filters
     */
    closeFilter: () => void;
    /**
     * A apply filter function for applying the filter once the filter is selected
     */
    applyFilter: (type: string, value: string, columnName: string, columnLabel: string, filter: any, setFilter: (input: any) => void) => void;
    /**
     * A clear filter function for applying the filter once the filter is selected
     */
    clearFilter: (columnName: string, filter: any, setFilter: (input: any) => void) => void;
    /**
     * The name of the column to apply the filter to
     */
    columnName: string;
    /**
     * Column label for the visual aspect of the filter
     */
    columnLabel: string;
    /**
     * The filters for the table
     */
    filters: any;
    /**
     * The filters to apply to the custom filters
     */
    setFilter: (input: any) => void;
    /**
     * A prop that determines if a filter should only be an equals filter
     */
    equals?: boolean;
}
export declare const NumberFilter: (props: IProps) => JSX.Element;
export {};
