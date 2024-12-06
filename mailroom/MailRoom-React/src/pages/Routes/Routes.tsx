import React, { useState, useEffect } from 'react';
import { DeprecatedDataTable, Loading, OperationButtons } from 'lt-components';
import { RouteModal, RouteExpandableRow } from './components';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import { useAPI } from '../../hooks';
import { UserStore } from '../../stores';
import './Routes.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
}

/** 
 * The routes page
 */
const RoutesBase = (props: IProps & RouteComponentProps) => {
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('routes', { apiName: 'homebase' });
  // Format the data to work with the table
  const [formattedData, setFormattedData] = useState<any>([]);
  // Get route endpoint maps to create rows
  const [routesLoading, routesData, setRoutesData, r1, r2, r3, refreshRoutesData] = useAPI('route_endpoint_maps', {});
  // Endpoint data for creation of rows
  const [endpointLoading, endpointData] = useAPI('endpoints');

  // Format the data for the table whenever it changes
  useEffect(() => {
    // If data has been initialized, format it
    if (data && data.length) {
      const format: any[] = [];

      // Loop through data and generate the formatted data (based on column fields)
      data.forEach((row: any) => {
        // Store data for each row in a new array
        const rowData: any[] = [];

        // Populate row data based on columns
        columns.forEach((column: any) => {
          // If the column's value is defined, store it
          if (row[column.field]) rowData.push(typeof row[column.field] === 'boolean' ? String(row[column.field]) : row[column.field]);
          // Otherwise, inject a null placeholder
          else rowData.push(null);
        });

        // Store formatted row in format array
        format.push(rowData);
      });

      setFormattedData(format);
    }
  }, [data]);

  /**
   * Navigate back to routes page and refresh data
   * @param refresh - whether to refresh the table (should be true when data was edited)
   */
  const navigateBack = (refresh?: boolean) => {
    // Refresh if asked
    if (refresh) {
      refreshData();
      refreshRoutesData();
    }
    // Navigate back to table
    props.history.push('/routes');
  };

  /**
   * Edit the selected item (open modal)
   */
  const editItem = (id: string) => {
    props.history.push(`/routes/${id}`);
  };

  /**
   * Options for the table
   */
  const options = {
    selectableRows: false,
    resizableColumns: false,
    expandableRows: true,
    renderExpandableRow: (rowData: any, rowMeta: any) => (
      <RouteExpandableRow 
        endpointData={endpointData} 
        routesData={routesData} 
        rowData={rowData} 
        rowMeta={rowMeta}
      />
    ),
    download: UserStore.user && UserStore.user.isAdmin,
  };

  /**
   * Columns for the table
   */
  const columns = [
    {
      name: 'ID',
      field: 'id',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'Name',
      field: 'name',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'Operations',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          // If the user is an admin, return the edit and delete buttons
          if (UserStore.user && UserStore.user.isAdmin) {
            return (
              <OperationButtons
                edit={() => editItem(tableMeta.rowData ? tableMeta.rowData[0] : -1)}
              />
            );
          }
          // Otherwise return the view button
          else {
            return (
              <OperationButtons
                view={() => editItem(tableMeta.rowData ? tableMeta.rowData[0] : -1)}
              />
            );
          }
        },
      },
    },
  ];

  return (
    <div className='full-container'>

      <div className='row m-0 align-center'>
        <h1>Routes</h1>
      </div>

      { // Show loading icon until data is ready
        routesLoading || endpointLoading || loading &&
        <Loading/>
      }
      { // Show the table once the data is ready
        !loading && !routesLoading && !endpointLoading &&
        <DeprecatedDataTable options={options} columns={columns} data={formattedData} />
      }

      <Route
        path='/routes/:id'
        render={() => {
          return <RouteModal navigateBack={navigateBack}/>;
        }}
      />

    </div>
  );
};

/** 
 * The routes page
 */
export const Routes = withRouter(RoutesBase);
