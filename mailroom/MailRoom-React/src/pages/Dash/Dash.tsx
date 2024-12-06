import React from 'react';
import { RecentActivity, StatBox, Loading } from 'lt-components';
// tslint:disable-next-line: no-submodule-imports
import { MdPeople, MdSend, MdSwapCalls } from 'react-icons/md';
// tslint:disable-next-line: no-submodule-imports
import { TiFlowChildren } from 'react-icons/ti';
import { useAPI } from '../../hooks';
import './Dash.scss';

/** 
 * The default dashboard page
 */
export const Dash = () => {
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('counts');

  return (
    <div className='full-container'>

      <h1>Dashboard</h1>

      { // Show loading icon until data is ready
        loading &&
        <Loading/>
      }
      { // Show the dashboard once the data is ready
        !loading &&
        <div className='row'>

          {/* Recent Activity column */}
          <div className='column'>
            <RecentActivity activities={activities}/>
          </div>

          {/* App Statistics column */}
          <div className='column'>

            <div className='row bottom-gutter'>
              <div className='column'>
                <StatBox
                  name='Leads'
                  value={data.leads}
                  icon={icons.leads}
                  color={colors.leads.light}
                />
              </div>
              <div className='column'>
                <StatBox
                  name='Endpoints'
                  value={data.endpoints}
                  icon={icons.endpoints}
                  color={colors.endpoints.light}
                />
              </div>
            </div>

            <div className='row bottom-gutter top-gutter'>
              <div className='column'>
                <StatBox
                  name='Field Maps'
                  value={data.field_maps}
                  icon={icons.fieldMaps}
                  color={colors.fieldMaps.light}
                />
              </div>
              <div className='column'>
                <StatBox
                  name='Users'
                  value={'N/A'}
                  icon={icons.users}
                  color={colors.users.light}
                />
              </div>
            </div>
            
          </div>
        </div>
      }

    </div>
  );
};

// HELPERS

/**
 * Colors for different categories
 */
const colors = {
  leads: {
    dark: 'var(--secondaryColor--dark)',
    light: 'var(--secondaryColor--light)',
  },
  endpoints: {
    dark: 'var(--primaryColor--dark)',
    light: 'var(--primaryColor--light)',
  },
  fieldMaps: {
    dark: 'var(--accentColor--dark)',
    light: 'var(--accentColor--light)',
  },
  users: {
    dark: 'var(--extraColor1--dark)',
    light: 'var(--extraColor1--light)',
  },
};

/**
 * Icons for different categories
 */
const icons = {
  leads: <MdSend style={{ color: colors.leads.dark }}/>,
  endpoints: <TiFlowChildren style={{ color: colors.endpoints.dark }}/>,
  fieldMaps: <MdSwapCalls style={{ color: colors.fieldMaps.dark }}/>,
  users: <MdPeople style={{ color: colors.users.dark }}/>,
};

// TODO: remove
const activities = [
  {
    icon: icons.endpoints,
    color: colors.endpoints.light,
    action: 'create' as 'create' | 'update' | 'delete',
    name: 'Important Lawyer',
    category: 'Endpoints',
    link: '/endpoints/1',
    date: new Date(),
    editor: 'Rob Rule',
  },
  {
    icon: icons.fieldMaps,
    color: colors.fieldMaps.light,
    action: 'update' as 'create' | 'update' | 'delete',
    name: 'Salesforce Insert',
    category: 'Field Maps',
    link: '/fieldMaps/1',
    date: new Date(),
    editor: 'Kyle Walsh',
  },
];