import React, { useState, useEffect } from 'react';
import { Button, DeprecatedDataTable, Loading, DeleteModal, OperationButtons } from 'lt-components';
import { FieldModal } from './components';
import { NotificationStore, UserStore } from '../../stores';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import { useAPI } from '../../hooks';
import './Fields.scss';

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
 * The fields page
 */
const FieldsBase = (props: IProps & RouteComponentProps) => {
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('fields');
  // Format the data to work with the table
  const [formattedData, setFormattedData] = useState<any>([]);
  // State to manage modal open state
  const [open, setOpen] = useState(false);
  // State to manage which row is selected for deletion
  const [deleteSelection, setDeleteSelection] = useState<any>(-1);
  // Used to grab field maps for reference to deletion
  const [FMLoading, FMData] = useAPI('field_maps', { apiName: 'mailroom' });
  // Get the data for the email endpoints
  const [emailEndpointLoading, emailEndpointData] = useAPI('email_endpoints', { apiName: 'mailroom' });
  // Get the data for the endpoints
  const [endpointsLoading, endpointsData] = useAPI('endpoints', { apiName: 'mailroom' });
  // Handles the loading status of the delete modal
  const [deleteLoading, setDeleteLoading] = useState(false);
  // The items that need to be deleted before the user can delete the desired field
  const [pendingDeletes, setPendingDeletes] = useState<any>(undefined);

  const [deleteName, setDeleteName] = useState('');

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

  const getEndpointFromEmailEndpoint = (id: number) => {
    // Loop through and find the required matches that could conflict a delete
    for (const endpoint of endpointsData) {
      if (id === endpoint.typeId && endpoint.type === 'email') return endpoint;
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

  const createPendingDeletes = () => {
    const fieldMapsURL = `https://mailroom.launchthat.com/fieldMaps`;
    const emailEndpointsURL = 'https://mailroom.launchthat.com/endpoints';

    setDeleteLoading(true);
    const pendingDeletes = {
      'Email Endpoints': [] as any[], 
      'Internal Field Map': [] as any[],
      'External Field Maps': [] as any[],
    };

    console.log('Field map data', FMData);

      // Loop through external and internal field map
    for (const map of FMData) {
        // Check to see if it is the internal field map
      if (map.internalEmail) {
          // Loop through the field map types inside of the fieldMap array
        for (const mapType of map.fieldMap) {
            // Find the values of the first object in the mapType array and loop through the fields in it
          for (const field of mapType[Object.keys(mapType)[0]]) {
            if (field.target === deleteSelection[1]) {
              console.log('We found it in the internal!!!');
              pendingDeletes['Internal Field Map'].push(
                  { name: `${Object.keys(mapType)[0]} - ${field.target}`, link: `${fieldMapsURL}/internal/${map.id}` });
              console.log('Please remove it before we can delete');
              break;
            } 
          }
        }
      } else {
          // Loop through the fields inside of the fieldMap array for external field maps
        for (const field of map.fieldMap) {
          if (field.target === deleteSelection[1]) {
            pendingDeletes['External Field Maps'].push({ 
              name: `${map.name} - ${field.target}`, 
              link: `${fieldMapsURL}/external/${map.id}`,
            });
            console.log('We found it the external map');
            console.log('Please remove it before we can delete');
            break;
          }
        }
      }
    }
    for (const emailEndpoint of emailEndpointData) {
      if (emailEndpoint.body.includes(`{{${deleteSelection[1]}}}`) || emailEndpoint.subject.includes(`{{${deleteSelection[1]}}}`)) {
        const endpoint = getEndpointFromEmailEndpoint(emailEndpoint.id);
        pendingDeletes['Email Endpoints'].push({ name: endpoint.name, link: `${emailEndpointsURL}/${endpoint.id}` });
      }
    }

    // Set the loading to false and set the pending deletes to the pending deletes
    // found inside of the field maps
    if (pendingDeletes['External Field Maps'].length !== 0 || 
      pendingDeletes['Internal Field Map'].length !== 0 || 
      pendingDeletes['Email Endpoints'].length !== 0) 
      setPendingDeletes(pendingDeletes);
    else setPendingDeletes(undefined);

    setDeleteLoading(false);
  };

  useEffect(() => {
    if (open) {
      createPendingDeletes();
    }
  }, [open]);

  /**
   * Navigate back to fields page and refresh data
   * @param refresh - whether to refresh the table (should be true when data was edited)
   */
  const navigateBack = (refresh?: boolean) => {
    // Refresh if asked
    if (refresh) refreshData();
    // Navigate back to table
    props.history.push('/fields');
  };

  /**
   * Edit the selected item (open modal)
   */
  const editItem = (id: string) => {
    props.history.push(`/fields/${id}`);
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
      name: 'Short Name',
      field: 'shortName',
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
        <h1>Fields</h1>
        { // Remove button if user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <Button className='m-l-a' onClick={() => props.history.push('/fields/add')}>Add Field</Button>
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
        path='/fields/:id'
        render={() => {
          return <FieldModal
            navigateBack={navigateBack}
          />;
        }}
      />

      {/** Modal that's shown for deletions */}
      <DeleteModal 
        pendingDeleteText={'You cannot delete this field until you remove it from the following items in Mailroom.'}
        pendingDeletes={pendingDeletes} 
        loading={deleteLoading} 
        open={open} 
        deleteName={deleteName}
        onClose={() => setOpen(false)} 
        delete={() => deleteItem()}
      />
    </div>
  );
};

/** 
 * The fields page
 */
export const Fields = withRouter(FieldsBase);