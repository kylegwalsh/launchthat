import React, { useState, useEffect } from 'react';
import { Button, DeprecatedDataTable, Loading, OperationButtons, DeleteModal } from 'lt-components';
import { RouteModal } from './components';
import { UserStore, NotificationStore } from '../../stores';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import { useAPI } from '../../hooks';
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
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('routes');
  // Format the data to work with the table
  const [formattedData, setFormattedData] = useState<any>([]);
  // State to manage modal open state
  const [open, setOpen] = useState(false);
  // State to manage which row is selected for deletion
  const [deleteSelection, setDeleteSelection] = useState(-1);
  // Handle the state of the delete modal loading
  const [deleteLoading, setDeleteLoading] = useState(false);
  // The items that need to be deleted before the user can delete the desired field
  const [pendingDeletes, setPendingDeletes] = useState<any>(undefined);
  // Format the data for the table whenever it changes
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

  /* 
     Map the route id to the endpoint by looping through the route data endpoint map, comparing it 
     to the id you want to delete, looping then looping through the endpoints data to find the name
     of the endpoint once you have the proper mapping.
  */
  const getRouteName = () => {
    const id = deleteSelection;
    for (let i = 0; i < data.length; i++) {
      if (data[i].id === id) {
        return data[i].name;
      }
    }
    return null;
  };

  /**
   * A function used to get the name for the delete modal
   * @param id - The id of the deleted item
   */
  const createDeleteName = (id: number) => {
    for (const item of data) {
      if (id === parseInt(item.id)) setDeleteName(item.name);
    }
  };

  const checkForEndpoints = async() => {
    const result = await queryAPI('GET', { apiName: 'mailroom', route: 'route_endpoint_maps', queryParams: `routeId=${deleteSelection}` });
    console.log(result);
    if (result.length === 0) return false;
    else return true;
  };

  const createPendingDeletes = async() => {
    const routesLink = 'https://mailroom.launchthat.com/routes';
    // Set the delete modal to a loading state
    setDeleteLoading(true);
    // Create the pending delete objects with the desired items that could be neccesary for pending deletion
    const pendingDeletes = {
      'Route': [] as any[], 
    };

    const endpointsExist = await checkForEndpoints();

    // If endpoints exists then specify the route that the endpoints must be removed from
    if (endpointsExist) {
      // Get the name of the route where the endpoints need to be removed from
      const routeName = getRouteName();
      pendingDeletes['Route'].push({ name: routeName, link: `${routesLink}/${deleteSelection}` });
      // Set the pending deletes of the routes table
      setPendingDeletes(pendingDeletes);
    } else {
      // If there were no pending deletes set the pending deletes to undefined
      setPendingDeletes(undefined);
    }
    // Set the delete modal to not be loading anymore
    setDeleteLoading(false);
  };

  useEffect(() => {
    if (open) {
      createPendingDeletes();  
    }
  }, [open]);

  /**
   * Navigate back to routes page and refresh data
   * @param refresh - whether to refresh the table (should be true when data was edited)
   */
  const navigateBack = (refresh?: boolean) => {
    // Refresh if asked
    if (refresh) refreshData();
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
   * Delete the selected item
   */
  const deleteItem = async() => {
    // Determine which item to delete based on which item was selected
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
        <h1>Routes</h1>
        { // Remove button if user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <Button className='m-l-a' onClick={() => props.history.push('/routes/add')}>Add Route</Button>
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
        path='/routes/:id'
        render={() => {
          return <RouteModal navigateBack={navigateBack}/>;
        }}
      />

      {/** Modal that's shown for deletions */}
      <DeleteModal
        pendingDeleteText={'You cannot delete this route until you remove all endpoints mapped to the route in Mailroom.'}
        loading={deleteLoading} 
        pendingDeletes={pendingDeletes}
        deleteName={deleteName}
        open={open} 
        onClose={() => setOpen(false)} 
        delete={() => deleteItem()}
      />
    </div>
  );
};

/** 
 * The routes page
 */
export const Routes = withRouter(RoutesBase);