import React, { useState, useEffect } from 'react';
import { DeprecatedDataTable, CustomHeadRender, DatePicker, CustomFilterList } from 'lt-components';
import { Link } from 'react-router-dom';
import { useDates } from '../../hooks';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import { Filter } from '../../utilities';
import { NotificationStore } from '../../stores';
import './CampaignsTable.scss';

/**
 * Get campaigns graphql query
 */
const GET_CAMPAIGNS = gql`
  query getCampaigns {
    campaigns(filters: $filters) 
    @rest(type: "Campaign", path: "/get-campaigns/?{args}") {
      account,
      accountId,
      campaign,
      campaignId,
      platform,
      status,
      impressions,
      clicks,
      cost,
      ctr,
      mds,
      cpmd,
      leads,
      cpl,
      mesoFormLeads,
      cpmfl,
      accounts,
      cpa,
      mesoAccounts,
      cpma,
      qualifiedLeads,
      cpql,
      viables,
      cpv,
      accountSendovers,
      cpas,
      accountMeetings,
      cpam,
      customers,
      cpcust
    }
  }
`;

/**
 * A function used to format the numbers in the table to the proper type
 * @param columnName - The name of the column that needs formatting
 * @param value - The value of the number being passed into the 
 */
const prettifyNumber = (value: string, type: 'percent' | 'dollar' | 'none') => {
  switch (type) {
  case 'dollar':
    return '$' + parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');      
  case 'percent':
    return parseFloat(value).toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,') + '%';
  default:
    return value;
  }
};

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * the initial filter options determined by the parent drill-down
   */
  filters?: {
    /**
     * the id of the account that was drilled-down
     */
    accountId?: number;
  };
}

/**
 * The campaign table component (handles it's own state / filters)
 */
export const CampaignsTable = (props: IProps) => {
  // Date filter
  const [filterStartDate, filterEndDate, setFilterDate] = useDates(Filter.defaultStartDate, Filter.defaultEndDate);
  // Actual filter state
  const [filters, setFilters] = useState({});
  // Determine if the column should be dsiplayed
  const [columnDisplay, setColumnDisplay] = useState<any>({});

  // Query database with graphql (applying filters)
  const { data, error, loading } = useQuery(GET_CAMPAIGNS, { 
    variables: { 
      filters: JSON.stringify({
        fields: Filter.formatFields({
          ...filters,
          accountId: props.filters && props.filters.accountId && {
            type: '=',
            value: props.filters.accountId,
          } || {},
        }),
        date: {
          start: filterStartDate.format('YYYY-MM-DD'),
          end: filterEndDate.format('YYYY-MM-DD'),
        },
      }),
    },
  });
  console.log('DATA', data);

  useEffect(() => {
    if (error) {
      NotificationStore.addNotification(
        'error', 
        error.message, 
        'Query Error',
        );
    }
  }, [error]);

  /**
   * Options for table
   */
  const options = {
    selectableRows: false,
    rowsPerPageOptions: [20, 50, 100],
    rowsPerPage: 20,
    responsive: 'scroll',
    filter: false,
    search: false,
    customToolbar: () => (
      <>
        <DatePicker 
          startDate={filterStartDate} 
          endDate={filterEndDate} 
          onDatesChange={(startDate, endDate) => setFilterDate(startDate, endDate)}
        />
        <CustomFilterList filters={filters} setFilter={setFilters} clearFilter={Filter.clearFilter}/>
      </>
    ),
    onColumnViewChange: (changedColumn: string, action: string) => {
      const newColumnDisplay: any = { ...columnDisplay };
      if (action === 'add') {
        newColumnDisplay[changedColumn] = true;
      } else if (action === 'remove') {
        newColumnDisplay[changedColumn] = false;
      }
      setColumnDisplay(newColumnDisplay);
    },
  };
  
  /**
   * Column options used to render table columns
   */
  const columns = [
    {
      name: 'campaign',
      label: 'Campaign',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.campaign !== undefined ? columnDisplay.campaign : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            sticky
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Word'}
          />
        ),
        setCellProps: () => ({ style: stickyStyle }),
        customBodyRender: (value: any, tableMeta: any, updateRadio: any) => {
          return (
            <span>
              <Link to={`/campaigns/${tableMeta.rowData[1]}/adgroups`}>{value}</Link>
            </span>
          );
        },
      },
    },
    {
      name: 'campaignId',
      label: 'Campaign ID',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.campaignId !== undefined ? columnDisplay.campaignId : false,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Equals'}
          />
        ),
      },
    },
    {
      name: 'platform',
      label: 'Platform',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.platform !== undefined 
        ? columnDisplay.platform :
         !props.filters || (!props.filters.accountId),
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Radio'}
            filterValues={[
              {
                value: 'AdWords',
                label: 'AdWords',
              },
              {
                value: 'Bing',
                label: 'Bing',
              },
            ]}
          />
        ),
      },
    },
    {
      name: 'account',
      label: 'Account',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.account !== undefined 
        ? columnDisplay.account 
        : !props.filters || !props.filters.accountId,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Word'}
          />
        ),
      },
    },
    {
      name: 'accountId',
      label: 'Account ID',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.accountId !== undefined 
        ? columnDisplay.accountId 
        : false,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Equals'}
          />
        ),
      },
    },
    {
      name: 'status',
      label: 'Status',
      rerender: filters,
      options: {
        filter: true,
        display: columnDisplay.status !== undefined 
        ? columnDisplay.status 
        : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Radio'}
            filterValues={[
              {
                value: 'Active',
                label: 'Active',
              },
              {
                value: 'Paused',
                label: 'Paused',
              },
              {
                value: 'Removed',
                label: 'Removed',
              },
            ]}
          />
        ),
      },
    },
    {
      name: 'impressions',
      label: 'Impressions',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.impressions !== undefined ? columnDisplay.impressions : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'clicks',
      label: 'Clicks',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.clicks !== undefined ? columnDisplay.clicks : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'ctr',
      label: 'CTR',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.ctr !== undefined ? columnDisplay.ctr : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'percent'),
      },
    },
    {
      name: 'cost',
      label: 'Cost',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cost !== undefined ? columnDisplay.cost : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'mds',
      label: 'MDs',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.mds !== undefined ? columnDisplay.mds : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpmd',
      label: 'CPMD',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpmd !== undefined ? columnDisplay.cpmd : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'leads',
      label: 'Leads',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.leads !== undefined ? columnDisplay.leads : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpl',
      label: 'CPL',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpl !== undefined ? columnDisplay.cpl : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'mesoFormLeads',
      label: 'Meso Form Leads',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.mesoFormLeads !== undefined ? columnDisplay.mesoFormLeads : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpmfl',
      label: 'CPMFL',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpmfl !== undefined ? columnDisplay.cpmfl : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'accounts',
      label: 'Accounts',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.accounts !== undefined ? columnDisplay.accounts : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpa',
      label: 'CPA',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpa !== undefined ? columnDisplay.cpa : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'mesoAccounts',
      label: 'Meso Accounts',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.mesoAccounts !== undefined ? columnDisplay.mesoAccounts : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpma',
      label: 'CPMA',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpma !== undefined ? columnDisplay.cpma : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'qualifiedLeads',
      label: 'Qualified Leads',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.qualifiedLeads !== undefined ? columnDisplay.qualifiedLeads : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpql',
      label: 'CPQL',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpql !== undefined ? columnDisplay.cpql : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'viables',
      label: 'Viables',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.viables !== undefined ? columnDisplay.viables : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpv',
      label: 'CPV',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpv !== undefined ? columnDisplay.cpv : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'accountSendovers',
      label: 'Account Sendovers',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.accountSendovers !== undefined ? columnDisplay.accountSendovers : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpas',
      label: 'CPAS',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpas !== undefined ? columnDisplay.cpas : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'accountMeetings',
      label: 'Account Meetings',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.accountMeetings !== undefined ? columnDisplay.accountMeetings : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpam',
      label: 'CPAM',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpam !== undefined ? columnDisplay.cpam : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
    {
      name: 'customers',
      label: 'Customers',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.customers !== undefined ? columnDisplay.customers : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'none'),
      },
    },
    {
      name: 'cpcust',
      label: 'CPCust',
      rerender: filters,
      options: {
        filter: true,
        sort: true,
        display: columnDisplay.cpcust !== undefined ? columnDisplay.cpcust : true,
        customHeadRender: (columnMeta: any, handleToggleColumn: any) => (
          <CustomHeadRender
            key={columnMeta.index}
            columnMeta={columnMeta}
            applyFilter={Filter.applyFilter}
            filters={filters}
            setFilter={setFilters}
            clearFilter={Filter.clearFilter} 
            handleToggleColumn={handleToggleColumn}
            fixedHeader 
            filter={'Number'}
          />
        ),
        customBodyRender: (value: string, tableMeta: any) => prettifyNumber(value, 'dollar'),
      },
    },
  ];

  return (
    <DeprecatedDataTable loading={loading} title={'Campaigns'} data={data && data.campaigns} options={options} columns={columns}/>
  );
};

// HELPERS

// Style to make table sidebar sticky
const stickyStyle = {
  position: 'sticky',
  left: 0,
  background: 'white',
  zIndex: 101,
  boxShadow: 'inset -1px 0px 0px rgba(224, 224, 224, 1)',
};