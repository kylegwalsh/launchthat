import React, { useState, useEffect } from 'react';
import { Button, DeprecatedDataTable, Loading, OperationButtons, DeleteModal } from 'lt-components';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import { useAPI } from '../../hooks';
import './Campaigns.scss';
import { CampaignsModal } from './components';
import { UserStore, NotificationStore } from '../../stores';
import { timeout } from 'q';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
}

export const CampaignsBase = (props: IProps & RouteComponentProps) => {
  const admin = UserStore.user && UserStore.user.isAdmin;

  // Get the data for the campaigns
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('campaigns');

  const [verticalLoading, verticalsData, setVerticalData] = useAPI('verticals');

  const [formattedData, setFormattedData] = useState<any>([]);
  // State to manage modal open state
  const [open, setOpen] = useState(false);
  // State to manage which row is selected for deletion
  const [deleteSelection, setDeleteSelection] = useState(-1);

  const [deleteName, setDeleteName] = useState('');

  // Handle the state of the delete modal loading
  const [deleteLoading, setDeleteLoading ] = useState(false);

  const [ pendingDeletes, setPendingDeletes ] = useState<any>(undefined);

  useEffect(() => {
    // If data has been initialized, format it
    if (data && data.length && verticalsData && verticalsData.length) {
      const format: any[] = [];

      // Loop through data and generate the formatted data (based on column fields)
      data.forEach((row: any) => {
        // Store data for each row in a new array
        const rowData: any[] = [];
        // Populate row data based on columns
        columns.forEach((column: any) => {
          // If the column's value is defined, store it
          if (row[column.field]) rowData.push(typeof row[column.field] === 'boolean' ? String(row[column.field]) : mapToName(column.field, row[column.field]));
          // Otherwise, inject a null placeholder
          else rowData.push(null);
        });

        // Store formatted row in format array
        format.push(rowData);
      });

      setFormattedData(format);
    }
  }, [data, verticalsData]);

  /**
   * Map any ids to their readable name
   * @param columnName - the name of the column to which you are mapping
   * @param id - the id which you want to map a name to
   */
  const mapToName = (columnName: string, id: number) => {
    switch (columnName) {
    case 'verticalId':
      for (let i = 0; i < verticalsData.length; i++) {
        if (verticalsData[i].id === id) return verticalsData[i].name;
      }
      return 'DELETED';
    // case 'siteId':
    //   for (let i = 0; i < sitesData.length; i++) {
    //     if (sitesData[i].id === id) return sitesData[i].name;
    //   }
    //   return 'DELETED';
    // case 'routeId':
    //   for (let i = 0; i < routesData.length; i++) {
    //     if (routesData[i].id === id) return routesData[i].name;
    //   }
    //   return 'DELETED';
    default:
      return id;
    }
  };

  /**
   * Navigate back to routes page and refresh data
   * @param refresh - whether to refresh the table (should be true when data was edited)
   */
  const navigateBack = (refresh?: boolean) => {
    // Refresh if asked
    if (refresh) refreshData();
    // Navigate back to table
    props.history.push('/campaigns');
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

  /**
   * Delete the selected item
   */
  const deleteItem = async() => {
    
    // Get the campaign attributions associated with the campaign that's getting deleted
    const campaignAttributions = await queryAPI('GET', {
      route: 'campaign_attributions',
      queryParams: `campaignId=${deleteSelection}`,
    });
    // Loop through the attributions, get the fields for each attribution and delete the attribution
    const attributionPromises = [];
    for (const attribution of campaignAttributions) {
      const attributionFields = await queryAPI('GET', {
        route: 'campaign_attribution_fields',
        queryParams: `campaignAttributionId=${attribution.id}`,
      });
      // Loop through the fields associated with each attribution and delete them
      const fieldPromises = [];
      for (const field of attributionFields) {
        const fieldDelete = queryAPI('DELETE', {
          route: 'campaign_attribution_fields',
          id: field.id,
        });
        fieldPromises.push(fieldDelete);
      }
      await Promise.all(fieldPromises);

      const attributionDelete = queryAPI('DELETE', {
        route: 'campaign_attributions',
        id: attribution.id,
      });
      attributionPromises.push(attributionDelete);
    }
    await Promise.all(attributionPromises);
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
   * Edit the selected item (open modal)
   */
  const editItem = (id: string) => {
    props.history.push(`/campaigns/${id}`);
  };

  /**
   * Options for the table
   */
  const options = {
    selectableRows: false,
    resizableColumns: false,
    download: admin,
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
      name: 'Vertical',
      field: 'verticalId',
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
          return (
            // If the user is an admin let them edit and delete
            admin ? 
            (
            <OperationButtons
              edit={() => editItem(tableMeta.rowData ? tableMeta.rowData[0] : -1)}
              delete={() => {
                setDeleteSelection(tableMeta.rowData ? tableMeta.rowData[0] : -1);
                createDeleteName(tableMeta.rowData ? tableMeta.rowData[0] : -1);
                setOpen(true);
              }}
            /> 
            ) :
            // Otherwise return the view button
            (
              <OperationButtons
                view={() => editItem(tableMeta.rowData ? tableMeta.rowData[0] : -1)}
              />
            )
          );
        },
      },
    },
  ];

  return (
    <div className='full-container'>

      <div className='row m-0 align-center'>
        <h1>Campaigns</h1>
        {
          admin && 
          <Button className='m-l-a' onClick={() => props.history.push('/campaigns/add')}>Add Campaign</Button>
        }
      </div>

      { // Show loading icon until data is ready
        loading &&
        <Loading/>
      }

      { // Show the table once the data is ready
        !(verticalLoading || loading) &&
        <DeprecatedDataTable options={options} columns={columns} data={formattedData} />
      }

      <Route
        path='/campaigns/:id'
        render={() => {
          return <CampaignsModal navigateBack={navigateBack}/>;
        }}
      />

      {/** Modal that's shown for deletions */}
      <DeleteModal
        pendingDeleteText={'You cannot delete this route until you remove all endpoints mapped to the route in Mailroom.'}
        loading={deleteLoading} 
        pendingDeletes={pendingDeletes} 
        open={open}
        deleteName={deleteName}
        onClose={() => setOpen(false)} 
        delete={() => deleteItem()}
      />
      
    </div>
  );
};

export const Campaigns = withRouter(CampaignsBase);