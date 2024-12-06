import React, { useState, useEffect } from 'react';
import { Button, DeprecatedDataTable, Loading, OperationButtons, DeleteModal } from 'lt-components';
import { SiteModal } from './components';
import { UserStore, NotificationStore } from '../../stores';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import { useAPI } from '../../hooks';
import './Sites.scss';
import { create } from 'domain';

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
 * The sites page
 */
const SitesBase = (props: IProps & RouteComponentProps) => {
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('sites');
  // Format the data to work with the table
  const [formattedData, setFormattedData] = useState<any>([]);
  // State to manage modal open state
  const [open, setOpen] = useState(false);
  // State to manage which row is selected for deletion
  const [deleteSelection, setDeleteSelection] = useState(-1);

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

  /**
   * A function used to get the name for the delete modal
   * @param id - The id of the deleted item
   */
  const createDeleteName = (id: number) => {
    for (const item of data) {
      if (id === parseInt(item.id)) setDeleteName(item.name);
    }
  };

  /**
   * Navigate back to sites page and refresh data
   * @param refresh - whether to refresh the table (should be true when data was edited)
   */
  const navigateBack = (refresh?: boolean) => {
    // Refresh if asked
    if (refresh) refreshData();
    // Navigate back to table
    props.history.push('/sites');
  };

  /**
   * Edit the selected item (open modal)
   */
  const editItem = (id: string) => {
    props.history.push(`/sites/${id}`);
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
      name: 'App Key',
      field: 'appKey',
      options: {
        filter: false,
        sort: true,
        display: true,
      },
    },
    {
      name: 'Active',
      field: 'active',
      options: {
        filter: true,
        sort: true,
        display: true,
      },
    },
    {
      name: 'Domain',
      field: 'domain',
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: 'Webmaster Email',
      field: 'webmasterEmail',
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: 'Deployment Email',
      field: 'deploymentEmail',
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: 'Deployment Slack',
      field: 'deploymentSlack',
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: 'UA-ID',
      field: 'uaId',
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: 'AW-ID',
      field: 'awId',
      options: {
        filter: false,
        sort: true,
        display: false,
      },
    },
    {
      name: 'Cloudflare Zone',
      field: 'cloudflareZone',
      options: {
        filter: false,
        sort: true,
        display: false,
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
        <h1>Sites</h1>
        { // Remove button if user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <Button className='m-l-a' onClick={() => props.history.push('/sites/add')}>Add Site</Button>
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
        path='/sites/:id'
        render={() => {
          return <SiteModal navigateBack={navigateBack}/>;
        }}
      />

      {/** Modal that's shown for deletions */}
      <DeleteModal deleteName={deleteName} open={open} onClose={() => setOpen(false)} delete={() => deleteItem()}/>
    </div>
  );
};

/** 
 * The sites page
 */
export const Sites = withRouter(SitesBase);