import React, { useState, useEffect } from 'react';
import { Button, DeprecatedDataTable, Loading, DeleteModal, OperationButtons } from 'lt-components';
import { EndpointModal } from './components';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import { useAPI } from '../../hooks';
import { UserStore, NotificationStore } from '../../stores';
import './Endpoints.scss';

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
 * The endpoints page
 */
const EndpointsBase = (props: IProps & RouteComponentProps) => {
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('endpoints');
  // Format the data to work with the table
  const [formattedData, setFormattedData] = useState<any>([]);
  // State to manage modal open state
  const [open, setOpen] = useState(false);
  // State to manage which row is selected for deletion
  const [deleteSelection, setDeleteSelection] = useState(-1);
  // Routes Data
  const [ remDataLoading, remData ] = useAPI('route_endpoint_maps');
  const [ routeLoading, routeData ] = useAPI('routes', { apiName: 'homebase' });
  // Format the data for the table whenever it changes
  
  // The state for the pending deletes
  const [ pendingDeletes, setPendingDeletes ] = useState<any>(undefined);

  const [ deleteLoading, setDeleteLoading ] = useState(false);
  // Name used for the delete name in the delete modal
  const [deleteName, setDeleteName] = useState('');

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

  const checkForRoutes = () => {
    const routes = [];
    /**
     * Loop through the route endpoint map to find the routes that match up with the endpoint
     */
    for (const rem of remData) {
      if (rem.endpointId === deleteSelection) {
        for (const route of routeData) {
          if (route.id === rem.routeId) {
            routes.push(route);
          }
        }
      }
    }
    return routes;
  };

  /**
   * A function used to get the name for the delete modal
   * @param id - The id of the deleted item
   */
  const createDeleteName = (id: number) => {
    for (const item of data) {
      console.log('Creating delete name with item: ', item);
      if (id === parseInt(item.id)) { setDeleteName(item.name); break; };
    }
  };

  const createPendingDeletes = () => {
    // Set the delete loading equal to true
    setDeleteLoading(true);
    // Get the routes that match to the endpoint
    const routes = checkForRoutes();
    
    console.log(routes);

    if (routes.length !== 0) {
      // Set the route that the page should go to
      const routesLink = '/routes';
      // Create the pending deletes for this page
      const pendingDeletes = {
        Routes: [] as any[], 
      };
      // Loop through the routes and push them to the pending deletes array
      for (const route of routes) {
        pendingDeletes.Routes.push({ name: route.name, link: `${routesLink}/${route.id}` });
      }
      setPendingDeletes(pendingDeletes);
    } else setPendingDeletes(undefined);

    setDeleteLoading(false);
  };

  useEffect(() => {
    if (open) {
      createPendingDeletes();
    }
  }, [open]);

  /**
   * Navigate back to endpoints page and refresh data
   * @param refresh - whether to refresh the table (should be true when data was edited)
   */
  const navigateBack = (refresh?: boolean) => {
    // Refresh if asked
    if (refresh) refreshData();
    // Navigate back to table
    props.history.push('/endpoints');
  };

  /**
   * Edit the selected item (open modal)
   */
  const editItem = (id: string) => {
    props.history.push(`/endpoints/${id}`);
  };

  /**
   * Delete the selected item
   */
  const deleteItem = async() => {
    // Find endpoint data object
    const endpoint = data.find((endpoint: any) => endpoint.id === deleteSelection);
    // Delete endpoint type entry associated with endpoint item
    await queryAPI('DELETE', {
      route: `${endpoint.type}_endpoints`,
      id: endpoint.typeId,
    });

    // Delete selected item
    try {
      await queryAPI('DELETE', {
        id: deleteSelection,
      });
      NotificationStore.addNotification(
        'success',
        `Successfully deleted.`,
        `Success`,
        2000,
      );
    } catch (err) {
      NotificationStore.addNotification(
        'error',
        `There was an error deleting.`,
        `Error`,
        2000,
      );
    }

    // Refresh the table after the deletion
    refreshData();
  };

  /**
   * Options for the table
   */
  const options = {
    selectableRows: false,
    resizableColumns: false,
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
      name: 'Type',
      field: 'type',
      options: {
        filter: true,
        sort: true,
      },
    },
    {
      name: 'Active',
      field: 'active',
      options: {
        filter: true,
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
                delete={() => {
                  setDeleteSelection(tableMeta.rowData ? tableMeta.rowData[0] : -1);
                  createDeleteName(tableMeta.rowData ? tableMeta.rowData[0] : -1);
                  setOpen(true);
                }}
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
        <h1>Endpoints</h1>
        { // Remove button if user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <Button className='m-l-a' onClick={() => props.history.push('/endpoints/add')}>Add Endpoint</Button>
        }
      </div>

      { // Show loading icon until data is ready
        loading &&
        <Loading/>
      }
      { // Show the table once the data is ready
        !loading &&
        <DeprecatedDataTable options={options} columns={columns} data={formattedData} />
      }

      <Route
        path='/endpoints/:id'
        render={() => {
          return <EndpointModal navigateBack={navigateBack}/>;
        }}
      />

      {/* Modal that's shown for deletions */}
      <DeleteModal 
        pendingDeleteText={'You cannot delete this endpoint until you remove it from the following routes.'}
        pendingDeletes={pendingDeletes}
        loading={loading}
        open={open} 
        deleteName={deleteName}
        onClose={() => setOpen(false)} 
        delete={() => deleteItem()}
      />
    </div>
  );
};

/** 
 * The endpoints page
 */
export const Endpoints = withRouter(EndpointsBase);