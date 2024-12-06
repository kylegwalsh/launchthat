import React, { Fragment, useState, useEffect } from 'react';
import { Button, Card, DeprecatedDataTable, Loading, DeleteModal, OperationButtons } from 'lt-components';
import { FieldMapModal } from './components';
import { withRouter, Route, RouteComponentProps, Switch, Link } from 'react-router-dom';
import { useAPI } from '../../hooks';
// tslint:disable-next-line: no-submodule-imports
import { MdKeyboardArrowRight } from 'react-icons/md';
import { UserStore, NotificationStore } from '../../stores';
import './FieldMaps.scss';

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
 * The field maps page
 */
const FieldMapsBase = (props: IProps & RouteComponentProps) => {
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('field_maps');
  // Format the data to work with the table
  const [formattedData, setFormattedData] = useState<any>([]);
  // Track id of internal field map
  const [internalId, setInternalId] = useState(-1);
  // State to manage modal open state
  const [open, setOpen] = useState(false);
  // State to manage which row is selected for deletion
  const [deleteSelection, setDeleteSelection] = useState(-1);
  // Fetch the email endpoints from the api
  const [ httpEndpointLoading, httpEndpointData ] = useAPI('http_endpoints');
  const [ endpointsLoading, endpointsData ] = useAPI('endpoints');
  // The items that are preventing a deletion of the field map
  const [ pendingDeletes, setPendingDeletes ] = useState<any>(undefined);
  // Check whether the delete modal is loading
  const [ deleteLoading, setDeleteLoading ] = useState(false);
  // Name used for the delete name in the delete modal
  const [deleteName, setDeleteName] = useState('');

  // Format the data for the table whenever it changes
  useEffect(() => {
    // If data has been initialized, format it
    if (data && data.length) {
      let internal = -1;
      const format: any[] = [];

      // Loop through data and generate the formatted data (based on column fields)
      data.forEach((row: any) => {
        if (row.internalEmail !== true) {
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
        }
        else {
          internal = row.id;
        }
      });

      setInternalId(internal);
      setFormattedData(format);
    }
  }, [data]);

  const checkForHttpEndpoints = () => {
    const endpoints = [];
    // Loop through and find the required matches that could conflict a delete
    for (const httpEndpoint of httpEndpointData) {
      if (httpEndpoint.fieldMapId === deleteSelection) {
        for (const endpoint of endpointsData) {
          if (endpoint.type === 'http' && httpEndpoint.id === endpoint.typeId) {
            endpoints.push(endpoint);
          }
        }
      }
    }
    return endpoints;
  };

  /**
   * A function used to get the name for the delete modal
   * @param id - The id of the deleted item
   */
  const createDeleteName = (id: number) => {
    for (const item of data) {
      if (id === parseInt(item.id)) { setDeleteName(item.name); break; }
    }
  };

  const createPendingDeletes = () => {
    // Set the delete loading equal to true
    setDeleteLoading(true);
    // Get the email endpoints that match to the field maps
    const httpEndpoints = checkForHttpEndpoints();
    console.log(httpEndpoints);

    if (httpEndpoints.length !== 0) {
      // The base url to use for the endpoint
      const endpointURL = `/endpoints`;
      // Create the pending deletes for this page
      const pendingDeletes = {
        'Http Endpoints': [] as any[], 
      };

      for (const httpEndpoint of httpEndpoints) {
        pendingDeletes['Http Endpoints'].push({ name: httpEndpoint.name, link: `${endpointURL}/${httpEndpoint.id}` });
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
   * Navigate back to field maps page and refresh data
   * @param internal - whether to refresh the table (should be true when data was edited)
   * @param refresh - whether to refresh the table (should be true when data was edited)
   */
  const navigateBack = (internal: boolean, refresh?: boolean) => {
    // Refresh if asked
    if (refresh) refreshData();
    // Navigate back to table
    props.history.push(`/fieldMaps${internal ? '' : '/external'}`);
  };

  /**
   * Edit the selected item (open modal)
   */
  const editItem = (id: string) => {
    props.history.push(`/fieldMaps/external/${id}`);
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

  // Determine if we're on the external page
  const externalPage = props.location.pathname.includes('fieldMaps/external');

  return (
    <div className='full-container'>

      <div className='row m-0 align-center'>
        <h1>{`${externalPage ? 'External ' : ''}Field Maps`}</h1>
        { // Render add button if we're on the external page and user is an admin
          externalPage && UserStore.user && UserStore.user.isAdmin &&
          <Button className='m-l-a' onClick={() => props.history.push('/fieldMaps/external/add')}>Add Field Map</Button>
        }
      </div>

      {/* Render either the default field map view or the external view */}
      <Switch>

        {/* Render external field map view */}
        <Route
          path='/fieldMaps/external'
          render={() => {
            return (
              <Fragment>
                { // Show loading icon until data is ready
                  loading &&
                  <Loading/>
                }
                { // Show the table once the data is ready
                  !loading &&
                  <Fragment>
                    <DeprecatedDataTable options={options} columns={columns} data={formattedData} />
                  </Fragment>
                }
              </Fragment>
            );
          }}
        />

        {/* Render default field map route (show links to internal / external views) */}
        <Route
          // path='/(internal|external/:id)'
          path='/fieldMaps'
          render={() => {
            return (
              <div className='row'>
                <div className='column'>
                  <Link to={`/fieldMaps/internal/${internalId}`} className='fieldMaps__link'>
                    <Card pad className={{ container: 'fieldMaps__cardContainer', content: 'fieldMaps__cardContent' }}>
                      <MdKeyboardArrowRight className='fieldMaps__arrowIcon' />
                      <h3 className='fieldMaps__h3'>Internal Map</h3>
                      <p className='fieldMaps__p'>Field map for internal emails and correspondence</p>
                    </Card>
                  </Link>
                </div>
                <div className='column'>
                  <Link to='/fieldMaps/external' className='fieldMaps__link'>
                    <Card pad className={{ container: 'fieldMaps__cardContainer', content: 'fieldMaps__cardContent' }}>
                      <MdKeyboardArrowRight className='fieldMaps__arrowIcon' />
                      <h3 className='fieldMaps__h3'>External Maps</h3>
                      <p className='fieldMaps__p'>Field maps for external HTTP requests</p>
                    </Card>
                  </Link>
                </div>
              </div>
            );
          }}
        />

      </Switch>

      {/* Render field map modal for both internal and external routes */}
      <Route
        path='/fieldMaps/internal/:id'
        render={() => {
          return <FieldMapModal categories={true} navigateBack={(refresh) => navigateBack(true, refresh)}/>;
        }}
      />
      <Route
        path='/fieldMaps/external/:id'
        render={() => {
          return <FieldMapModal categories={false} navigateBack={(refresh) => navigateBack(false, refresh)}/>;
        }}
      />

      {/* Modal that's shown for deletions */}
      <DeleteModal 
        loading={deleteLoading}
        pendingDeletes={pendingDeletes}
        pendingDeleteText={'You cannot delete this field map until you remove it from the following HTTP endpoints.'}
        open={open}
        deleteName={deleteName}
        onClose={() => setOpen(false)} 
        delete={() => deleteItem()}
      />
    
    </div>
  );
};

/** 
 * The field maps page
 */
export const FieldMaps = withRouter(FieldMapsBase);