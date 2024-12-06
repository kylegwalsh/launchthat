import React, { useState, useEffect, Fragment } from 'react';
import { Button, DeprecatedDataTable, Loading, OperationButtons, ProgressBar } from 'lt-components';
import { LeadModal } from './components';
import { withRouter, Route, RouteComponentProps } from 'react-router-dom';
import { useAPI, useServerSidePagination } from '../../hooks';
import { Format } from '../../utilities';
import { NotificationStore, UserStore } from '../../stores';
import './Leads.scss';

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
 * The leads page
 */
const LeadsBase = (props: IProps & RouteComponentProps) => {
  // The column names, required for the server-side rendering hook
  const columnFields = ['id', 'version', 'createdAt', 'deliveryStatus', 'verticalId', 'siteId', 'routeId', 'channel'];
  // Fetch data using server-side rendering
  const [page, count, rowsPerPage, changePage, filter, changeFilter, changeRowsPerPage, sort, sortChange, loading, data, setData, errors, 
    setErrors, queryAPI, refreshData, search] = useServerSidePagination('leads', columnFields, { column: 'id', direction: 'desc' });

  // Fetch details on different data types from homebase
  const [ routesLoading, routesData] = useAPI('routes', { apiName: 'homebase' });
  const [ sitesLoading, sitesData] = useAPI('sites', { apiName: 'homebase' });
  const [ verticalsLoading, verticalsData] = useAPI('verticals', { apiName: 'homebase' });

  // Handle filters on table
  const [localFilter, setLocalFilter] = useState<any[][]>([]);
  // Handle search on table
  const [searchText, setSearchText] = useState('');
  // Handle whether search is opened on table
  const [searchOpened, setSearchOpened] = useState(false);
  // Track filter options of table
  const [filterOptions, setFilterOptions] = useState();
  // Manage progress bar during refires
  const [firing, setFiring] = useState(false);
  const [firingPercent, setFiringPercent] = useState(0);

  /**
   * Create filter options when data is retrieved from homebase
   */
  useEffect(() => {
    if (!routesLoading && !sitesLoading && !verticalsLoading) {
      // Initialize filter object
      const filter: any = {
        verticals: [],
        routes: [],
        sites: [],
      };

      // Create vertical filters
      for (let i = 0; i < verticalsData.length; i++) {
        filter.verticals.push(verticalsData[i].name);
      }
      // Create route filters
      for (let i = 0; i < routesData.length; i++) {
        filter.routes.push(routesData[i].name);
      }
      // Create site filters
      for (let i = 0; i < sitesData.length; i++) {
        filter.sites.push(sitesData[i].name);
      }

      setFilterOptions(filter);
    }
  }, [routesLoading, sitesLoading, verticalsLoading]); 

  // Use Effect to listen for loading for the search bar input
  useEffect(() => {
    // Check for loading to be done and add an event listener to the tables search bar
    if (searchOpened) {
      const table = document.querySelector('[aria-label="Search"] input');
      if (table) {
        table.addEventListener('keydown', handleSearch);
      } 
      return function cleanup() {
        if (table) {
          table.removeEventListener('keydown', handleSearch);
        }
      };
    }
  }, [searchOpened, searchText]);

  /**
   * 
   * @param columnName - The name of the column to which you are mapping
   * @param name - The name of the of row that you want to map to an ID
   */
  const mapToId = (columnName: string, name: string) => {
    switch (columnName) {
    case 'verticalId':
      for (let i = 0; i < verticalsData.length; i++) {
        if (verticalsData[i].name === name) return verticalsData[i].id;
      }
      return -1;
    case 'siteId':
      for (let i = 0; i < sitesData.length; i++) {
        if (sitesData[i].name === name) return sitesData[i].id;
      }
      return -1;
    case 'routeId':
      for (let i = 0; i < routesData.length; i++) {
        if (routesData[i].name === name) return routesData[i].id;
      }
      return -1;
    default:
      return name;
    }
  };

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
    case 'siteId':
      for (let i = 0; i < sitesData.length; i++) {
        if (sitesData[i].id === id) return sitesData[i].name;
      }
      return 'DELETED';
    case 'routeId':
      for (let i = 0; i < routesData.length; i++) {
        if (routesData[i].id === id) return routesData[i].name;
      }
      return 'DELETED';
    default:
      return id;
    }
  };

  // Format the data to work with the table
  const [formattedData, setFormattedData] = useState<any>([]);

  /**
   * A function to handle the search keydown even listener
   * @param e - event of the keydown on search input
   */
  const handleSearch = (e: any) => {
    if (e.keyCode === 13) {
      // tslint:disable-next-line: radix
      if (!isNaN(parseInt(searchText))) {
        search(searchText);
        setSearchText('');
      } else {
        NotificationStore.addNotification('error', 'Please enter a number, search only supports IDs', 'Wrong Search Input', 2000);
      }
    }
  };

  // Format the data for the table whenever it changes
  useEffect(() => {
    // If data has been initialized, format it
    if (data && data.length && verticalsData && verticalsData.length && routesData && routesData.length
      && sitesData && sitesData.length) {
      const format: any[] = [];
      // Loop through data and generate the formatted data (based on column fields)
      data.forEach((row: any) => {
        // Store data for each row in a new array
        const rowData: any[] = [];
        // Populate row data based on columns
        columns.forEach((column: any) => {
          // If the column's value is defined and run a mapping function to map id's to names, store it
          if (row[column.field]) {
            // Format booleans as strings
            if (typeof row[column.field] === 'boolean') rowData.push(String(row[column.field]));
            // Format dates nicely
            else if (column.field === 'createdAt') rowData.push(Format.dateTime(new Date(row[column.field])));
            // Replace any ids with the names of the resources
            else rowData.push(mapToName(column.field, row[column.field]));
          }
          else rowData.push(null);
        });
        // Store formatted row in format array
        format.push(rowData);
      });
      console.log('Formatted data', format);
      setFormattedData(format);
    }
  }, [data, verticalsData, routesData, sitesData]);

  /**
   * Navigate back to leads page and refresh data
   * @param refresh - whether to refresh the table (should be true when data was edited)
   */
  const navigateBack = (refresh?: boolean) => {
    // Refresh if asked
    if (refresh) refreshData();
    // Navigate back to table
    props.history.push('/leads');
  };

  /**
   * View the selected item (open modal)
   */
  const viewItem = (id: string, version: string) => {
    props.history.push(`/leads/${id}/${version}`);
  };

  /**
   * Options for the table
   * @param  selectableRows - set the selectable rows equal to false
   * @param resizableColumns - don't let them resize columns
   * @param serverSide - enable server side rendering for the leads table
   * @param page - the page that the table is currently on, uses the server side rendering page
   * @param count - the count variable that is the total number of items returned from the server side rendering api
   * @param rowsPerPage - the amount of rows that should show up on a given page
   * @param download - whether to allow downloads (export csv) from the table
   * @param onTableChange - handles the logic when the table changes
   */
  const options = {
    selectableRows: false,
    resizableColumns: false,
    serverSide: true,
    page: page - 1,
    count,
    rowsPerPage,
    download: UserStore.user && UserStore.user.isAdmin,
    onTableChange: (action: any, tableState: any) => {
      console.log(action);
      // Take a specific action based on change
      switch (action) {
      // Page has changed
      case 'changePage':
        // When the page changes update the page with the new one
        changePage(tableState.page);
        break;
      // Number of rows per page has changed
      case 'changeRowsPerPage':
        // When the user selects the amount of rows per page update the rows per page
        changeRowsPerPage(tableState.rowsPerPage);
        break;
      // Filter has changed
      case 'filterChange':
        // Mapped filter to change the names to id values for api lookup
        const mappedFilter: any = [];
        // For loop to loop through the filter array and map values from it into a new mapped filter array
        for (let i = 0; i < tableState.filterList.length; i++) {
          mappedFilter.push([]);
          for (let j = 0; j < tableState.filterList[i].length; j++) {
            const filterId = mapToId(columnFields[i], tableState.filterList[i][j]);
            mappedFilter[i].push(filterId);
          }
        }
        // When the filter is changed update the desired filter
        // Set the local filter to maintain names without affecting the api lookup
        setLocalFilter(tableState.filterList);
        changeFilter(mappedFilter);
        break;
      // Filters have been reset
      case 'resetFilters':
        // Reset the filter array
        // Set the local filter to maintain names without affecting the api lookup
        setLocalFilter([]);
        changeFilter([]);
        break;
      // Search has been performed
      case 'search':
        if (searchOpened && ((tableState.searchText === null && searchText === null) 
        || (tableState.searchText === null && searchText.length !== 1))) setSearchOpened(false);
        else {
          const tempText = tableState.searchText === null
          ? tableState.searchText : tableState.searchText.replace(/[^\d]+/, '').replace(/\b0+/g, '');
          setSearchText(tempText);
        }
        // When the user closes the search box set search opened to false
        break;
      // Search box has been opened
      case 'onSearchOpen':
        setSearchOpened(true);
        break;
      // Column has been sorted
      case 'sort':
        let field: string | undefined;
        let direction: string | undefined;
        
        // Loop through columns and determine which one is sorted
        for (let i = 0; i < tableState.columns.length; i++) {
          if (tableState.columns[i].sortDirection) {
            field = columnFields[i];
            direction = tableState.columns[i].sortDirection;
            break;
          }
        }

        // Sort in server side
        if (field) sortChange(field, direction);
        break;
      }
    },
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
        filterList: filter[0],
      },
    },
    {
      name: 'Version',
      field: 'version',
      options: {
        filter: false,
        sort: false,
      },
    },
    {
      name: 'Created Date',
      field: 'createdAt',
      options: {
        filter: false,
        sort: true,
      },
    },
    {
      name: 'Delivery Status',
      field: 'deliveryStatus',
      options: {
        filter: true,
        sort: true,
        filterList: localFilter[3],
        filterOptions: ['unsent', 'success', 'failed', 'inactive'],
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <span className={`leads__status leads__status--${tableMeta.rowData ? tableMeta.rowData[3] : ''}`}>
              {tableMeta.rowData ? tableMeta.rowData[3] : ''}
            </span>
          );
        },
      },
    },
    {
      name: 'Vertical',
      field: 'verticalId',
      options: {
        filter: true,
        sort: false,
        filterList: localFilter[4],
        filterOptions: filterOptions ? filterOptions.verticals : undefined,
      },
    },
    {
      name: 'Site',
      field: 'siteId',
      options: {
        filter: true,
        sort: false,
        filterList: localFilter[5],
        filterOptions: filterOptions ? filterOptions.sites : undefined,
      },
    },
    {
      name: 'Route',
      field: 'routeId',
      options: {
        filter: true,
        sort: false,
        filterList: localFilter[6],
        filterOptions: filterOptions ? filterOptions.routes : undefined,
      },
    },
    {
      name: 'Channel',
      field: 'channel',
      options: {
        filter: true,
        sort: true,
        filterList: localFilter[7],
        filterOptions: ['web', 'call', 'chat', 'facebook'],
      },
    },
    {
      name: 'Operations',
      options: {
        filter: false,
        sort: false,
        customBodyRender: (value: any, tableMeta: any, updateValue: any) => {
          return (
            <OperationButtons
              view={() => viewItem(tableMeta.rowData ? tableMeta.rowData[0] : -1, tableMeta.rowData ? tableMeta.rowData[1] : -1)}
            />
          );
        },
      },
    },
  ];

  // Apply sorting to table based on server side results
  if (sort.column) {
    const index = columns.findIndex((item) => item.field === sort.column);
    // @ts-ignore
    if (columns[index] && columns[index].options) columns[index].options.sortDirection = sort.direction;
  }

  /**
   * Function handling refire of all failed / unsent leads
   */
  const refireAll = async() => {
    // Show progress bar
    setFiring(true);

    // Tell api to refire all failed leads
    const result = await queryAPI('POST', { route: 'refire_all' });

    // If there was an error, abort
    if (result.error) {
      setFiring(false);
      return;
    }

    // Update progress bar
    updateProgress(0);
  };

  /**
   * Update the percentage of the progress bar
   */
  const updateProgress = (percent: number) => {
    // Increase progress bar based on time (30s til refresh)
    if (percent < 100) {
      const newPercent = percent + 1;
      setFiringPercent(newPercent);
      setTimeout(() => updateProgress(newPercent), 300);
    }
    // Otherwise we're done and need to update the data with the new leads
    else {
      refreshData();
      setFiring(false);
      setFiringPercent(0);
    }
  };

  return (
    <div className='full-container'>

      <div className='row m-0 align-center'>
        <h1>Leads</h1>
        { // Remove button if user is not allowed to refire
          UserStore.user && UserStore.user.isAdmin &&
          <Button className='m-l-a' onClick={() => refireAll()}>Refire All Failed Leads</Button>
        }
      </div>

      { // Show loading icon until data is ready
        (loading || verticalsLoading || sitesLoading || routesLoading) && <Loading/>
      }
      { // Show the table once the data is ready
        (!loading && !verticalsLoading && !sitesLoading && !routesLoading) &&
        <Fragment>
          { // If we are not refiring, show the data table
            !firing &&
            <DeprecatedDataTable options={options} columns={columns} data={formattedData} />
          }
          { // If we are refiring, show the progress bar
            firing &&
            <div className='leads__progressContainer'>
              <strong>Refiring...</strong>
              <ProgressBar percent={firingPercent} caps='round'/>
            </div>
          }
        </Fragment>
      }

      <Route
        path='/leads/:id/:version'
        render={() => {
          return <LeadModal navigateBack={navigateBack}/>;
        }}
      />

    </div>
  );
};

/** 
 * The leads page
 */
export const Leads = withRouter(LeadsBase);
