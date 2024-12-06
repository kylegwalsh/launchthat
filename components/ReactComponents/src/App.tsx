import * as React from 'react';
const { useState } = React;
import { Switch, Route, BrowserRouter } from 'react-router-dom';
import { Dashboard, Breadcrumbs, DeprecatedDataTable, Tabs, CustomHeadRender, CustomFilterList, DatePicker } from './components';
// tslint:disable-next-line: no-submodule-imports
import { MdPeople, MdList, MdCloudDownload, MdSettings } from 'react-icons/md';
// import { TableCell } from '@material-ui/core';
// import ReactTooltip from 'react-tooltip';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import './App.scss';
import './styles/styles.scss';
import * as moment from 'moment';

// Handle filters on table

const onDatesChange = (startDate: moment.Moment | null, endDate: moment.Moment | null) => {
  console.log('Start date: ', startDate, ' End Date: ', endDate);
};

const MUITheme = createMuiTheme({
  overrides: {
    MUIDataTableToolbar: {
      left: {
        flex: '1 1 10%',
      },
      actions: {
        flex: '1 1 90%',
      },
    },
    MUIDataTableSelectCell: {
      fixedHeader: {
        backgroundColor: 'white',
        zIndex: '101 !important',
      },
    },
    MuiToolbar: {
      root: {
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
      },
    },
    MUIDataTableHeadCell: {
      root: {
        fontSize: 15,
      },
    },
    // MUIDataTable: {
    //   responsiveScroll: {
    //     // overflowX: 'none',
    //     // height: 'auto',
    //     // maxHeight: 'auto',
    //   },
    // },
    MuiCheckbox: {
      root: {
        padding: 0,
        // fontSize: '1rem !important',
      },
    },
    MuiTableRow: {
      root: {
        height: 'auto',
      },
    },
    MUIDataTableBodyCell: {
      root: {
        minWidth: 120,
        paddingTop: 0,
        paddingBottom: 0,
        // border: '1px solid black', 
      },
    },
    MuiTableCell: {
      root: {
        padding: 0,
        paddingRight: 4,
        paddingLeft: 4,
        borderBottom: '1px solid rgba(224, 224, 224, 1)',
        borderRight: '1px solid rgba(224, 224, 224, 1)',
      },
    },
  },
});

  /**
   * Apply a filter on the table
   * @param type - The type of the filter being used (equals, less than, etc.)
   * @param value - The value passed back to compare to
   * @param columnName - The name of the column the filter should be applied to
   * @param columnLabel - The column label for (For aesthetic purposes)
   */
// tslint:disable-next-line: max-line-length
const applyFilter = (type: string, value: string, columnName: string, columnLabel: string, filters: any, setFilter: (input: any) => void) => {
  const newFilters: any = { ...filters };
  newFilters[columnName] = {
    type,
    value,
    label: columnLabel,
  };
  setFilter(newFilters);
};

  /**
   * Clear the filter on a column
   * @param columnName - the name of the column to clear the filter for
   */
const clearFilter = (columnName: string, filters: any, setFilter: (input: any) => void) => {
  const newFilters: any = { ...filters };
  newFilters[columnName] = {
    type: '',
    value: '',
    label: '',
  };
  setFilter(newFilters);
};

// const values = [
//   {
//     value: 'This is 1',
//     label: 'New label 1',
//   },
//   {
//     value: 'This is 2',
//     label: 'New label 2 crazy large value',
//   },
//   {
//     value: 'This is 3',
//     label: 'New label 3',
//   },
//   {
//     value: 'This is 4',
//     label: 'New label 4',
//   },
// ];

const Table = () => {
  const [filters, setFilters] = useState({});
  return (
    <div className='container'>
          <DeprecatedDataTable
            title='Keywords'
            data={creditCards}
            columns={[
              {
                reRenderFilters: filters,
                name: 'name',
                label: 'Name',
                options: {
                  customHeadRender: (columnMeta: any, handleToggleColumn: any) => {
                      return (<CustomHeadRender
                            key={columnMeta.index}
                            applyFilter={applyFilter}
                            clearFilter={clearFilter}
                            // filterValues={values}
                            filters={filters}
                            setFilter={setFilters}
                            sticky
                            columnMeta={columnMeta} 
                            handleToggleColumn={handleToggleColumn} 
                            filter={'Number'}
                      />);
                  },
                  setCellProps: () => ({ style }),
                  sort: true,
                },
              },
              {
                name: 'cardNumber',
                label: 'Card Number',
              },
              {
                name: 'cvc',
                label: 'CVC',
              },
              {
                name: 'expiry',
                label: 'Expiry',
              },
              {
                name: 'random',
                label: 'Random',
              },
              {
                name: 'random1',
                label: 'Card Number',
              },
              {
                name: 'random2',
                label: 'CVC',
              },
              {
                name: 'random3',
                label: 'Expiry',
              },
              {
                name: 'random4',
                label: 'Name',
              },
              {
                name: 'random5',
                label: 'Card Number',
              },
              {
                name: 'random6',
                label: 'CVC',
              },
              {
                name: 'random7',
                label: 'Expiry',
              },
              {
                name: 'random8',
                label: 'Card Number',
              },
              {
                name: 'random9',
                label: 'CVC',
              },
              {
                name: 'random10',
                label: 'Expiry',
              },
              {
                name: 'random11',
                label: 'Expiry',
              },
              {
                name: 'random12',
                label: 'Expiry',
              },
              {
                name: 'random13',
                label: 'Expiry',
              },
              {
                name: 'random14',
                label: 'Expiry',
              },
              {
                name: 'random15',
                label: 'Expiry',
              },
            ]}
            options={{
              responsive: 'scroll',
              selectableRows: false,
              customToolbar: () => {
                return (
                  <>
                    <DatePicker 
                        startDate={null} 
                        endDate={null} 
                        onDatesChange={onDatesChange}
                      />
                    <CustomFilterList setFilter={setFilters} clearFilter={clearFilter} filters={filters}/>
                  </>
                );
              },
            }}
          />
        </div>
  );
}

export const App = () => {

  return (
    <BrowserRouter>
      <Switch>

        {/* Dashboard route (renders other routes inside Dashboard component) */}
        <Route
          path='*'
          render={() => 
            // Wrap the dashboard with the custom theme we want to use for the material design table
            <MuiThemeProvider theme={MUITheme}>
              <Dashboard
                defaultRoute='/test'
                headerLogo={`${process.env.PUBLIC_URL}/images/horizontal-logo.png`}
                routes={routes}
                user={{ firstName: 'Kyle', lastName: 'Walsh' }}
                signOut={() => console.log('Done')}
                sidebarSize={'mini'}
                profileOptions={[
                  {
                    icon: MdSettings,
                    text: 'Account Settings',
                    action: () => window.open('https://myaccount.google.com/', '_blank'),
                  },
                  {
                    icon: MdCloudDownload,
                    text: 'Download LinkFox',
                    action: () => window.open('https://chrome.google.com/webstore/detail/linkfox/nijgdpmhbfmjeldjdlkokgaffmoiipfe', '_blank'),
                  },
                ]}
              />
            </MuiThemeProvider>
          }
        />

      </Switch>
    </BrowserRouter>
  );
};

const routes = [
  // Links page
  {
    name: 'Verticals',
    path: '/verticals',
    exact: false,
    render: () => {

      return (
        <div className='container'>
          <Breadcrumbs
            className='breadCrumbTest' 
            pages={[
              {
                icon: MdPeople,
                path: '/users',
                text: 'Users',
              },
              {
                icon: MdPeople,
                text: 'Verticals',
              },
            ]}
          />
          <Tabs
            className={{ container: 'tabsTest' }}
            tabs={[
              {
                path: '/verticals',
                text: 'Verticals',
                active: true,
              },
              {
                path: '/users',
                text: 'Users',
              },
            ]}
          />
        </div>
      );
    },
    icon: <MdList/>,
  },
  // Users page
  {
    name: 'Users',
    path: '/users',
    exact: false,
    render: () => {
      return (
        <Table/>
      );
    },
    icon: <MdPeople/>,
  },
];

const creditCards = [
  {
    cardNumber: '5500005555555559',
    name: 'Tom Tallis',
    cvc: '582',
    expiry: '02/24',
    random: null,
    random1: 'stress',
    random2: 'test',
    random3: 'gfdslfndfldsfndlfnslndfdljf',
    random4: 'fasdfasdfndfdkfsndfdfs',
    random5: 'test',
    random6: 'another',
    random7: 'Another',
    random8: 'aanother one',
    random9: 'another',
    random10: 'This is almost the last one',
    random11: 'another one',
    random12: 'Another',
    random13: 'aanother one',
    random14: 'another',
    random15: 'This is almost the last one',
  },
];

const style = {
  position: 'sticky',
  left: 0,
  background: 'white',
  zIndex: 101,
};