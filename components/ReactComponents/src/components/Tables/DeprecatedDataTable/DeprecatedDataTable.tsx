import * as React from 'react';
import MUIDataTable from 'mui-datatables';
import './DeprecatedDataTable.scss';
import { LoadingOverlay } from './components/LoadingOverlay/LoadingOverlay';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * A prop that is used to determine if the table is loading or not
   */
  loading?: boolean;
  /**
   * title to show on the table
   */
  title?: string;
  /**
   * list of column details to give the table
   */
  columns: any[];
  /**
   * the data being displayed in the table (requires same number of fields as headers prop)
   */
  data?: any[];
  /**
   * a list of options used to describe the table
   */
  options: {
    /**
     * Determines the behavior of the table when it needs to become responsive
     */
    responsive?: string;
    /**
     * function to render a custom toolbar
     */
    customToolbar?: () => React.ReactNode;
    /**
     * whether to use server side rendering on the table
     */
    serverSide?: boolean;
    /**
     * determines if the rows can be selected
     */
    selectableRows?: boolean;
    /**
     * A function that runs when a row is selected
     */
    onRowsSelect?: (currentRowsSelected: any[], allRowsSelected: any[]) => void;
    /**
     * callback function that's called when a row is clicked
     */
    onRowClick?: (rowData: string[], rowMeta: {
      dataIndex: number, rowIndex: number,
    }) => any;
    /**
     * callback function that's called when a cell is clicked
     */
    onCellClick?: (colData: any, cellMeta: { colIndex: number, rowIndex: number, dataIndex: number }) => void;
    /**
     * renders a custom toolbar when items on the table are selected
     */
    customToolbarSelect?: (selectableRows: any, displayData: any, setSelectedRows: any) => void;
    /**
     * makes boolean that makes the rows have an expandable bottom
     */
    expandableRows?: boolean;
    /**
     * renders the exapandable row component
     */
    renderExpandableRow?: (rowData: string[], rowMeta: any) => React.ReactNode;
    /**
     * determines if a certain row can be selected
     */
    isRowSelectable?: (dataIndex: number) => boolean;
    /**
     * function to run when row is deleted natively
     */
    onRowDelete?: (rowsDeleted: string[]) => void;
    /**
     * function to run when page changes (server side)
     */
    onChangePage?: (currentPage: number) => void;
    /**
     * function to run when filter changes (server side)
     */
    onFilterChange?: (changedColumn: string, filterList: string[]) => void;
    /**
     * function to run when column is sorted (server side)
     */
    onColumnSortChange?: (changedColumn: string, direction: string) => void;
    /**
     * whether to enable the download (csv export) feature
     */
    download?: boolean;
    /**
     * Pass in a custom row to render in the table
     */
    customRowRender?: (data: any, dataIndex: number, rowIndex: number) => React.ReactNode;
    /**
     * The amount of rows per page that the user can pick from
     */
    rowsPerPageOptions?: number[]
    /**
     * The amount of starting rows per page
     */
    rowsPerPage?: number
  };
}

/** 
 * A data table component
 */
export const DeprecatedDataTable = (props: IProps) => {
  return (
    <div className={`table ${props.className ? props.className : ''} ${props.loading ? 'table-hidden' : ''}`}>
      <MUIDataTable
        title={props.title}
        columns={props.columns}
        data={Array.isArray(props.data) ? props.data : []}
        options={{ ...defaultOptions, ...props.options }}
      />
      {props.loading && <LoadingOverlay/>}
    </div>
  );
};

// HELPERS

/**
 * Default options that are fed to every table
 */
const defaultOptions = {
  print: false,
  rowsPerPageOptions: [10, 50, 100],
  responsive: 'scroll',
  // fixedHeader: false,
};