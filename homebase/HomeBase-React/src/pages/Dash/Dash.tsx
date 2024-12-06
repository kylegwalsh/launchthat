import React from 'react';
import { RecentActivity, StatBox, Loading } from 'lt-components';
// tslint:disable-next-line: no-submodule-imports
import { MdLayers, MdList, MdPeople, MdTune, MdCallSplit, MdDesktopMac } from 'react-icons/md';
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
                  name='Campaigns'
                  value={data.campaigns}
                  icon={icons.campaigns}
                  color={colors.campaigns.light}
                />
              </div>
              <div className='column'>
                <StatBox
                  name='Verticals'
                  value={data.verticals}
                  icon={icons.verticals}
                  color={colors.verticals.light}
                />
              </div>
            </div>

            <div className='row bottom-gutter top-gutter'>
              <div className='column'>
                <StatBox
                  name='Fields'
                  value={data.fields}
                  icon={icons.fields}
                  color={colors.fields.light}
                />
              </div>
              <div className='column'>
                <StatBox
                  name='Sites'
                  value={data.sites}
                  icon={icons.sites}
                  color={colors.sites.light}
                />
              </div>
            </div>

            <div className='row top-gutter'>
              <div className='column'>
                <StatBox
                  name='Routes'
                  value={data.routes}
                  icon={icons.routes}
                  color={colors.routes.light}
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
  campaigns: {
    dark: 'var(--secondaryColor)',
    light: 'var(--secondaryColor--light)',
  },
  verticals: {
    dark: 'var(--primaryColor)',
    light: 'var(--primaryColor--light)',
  },
  fields: {
    dark: 'var(--accentColor)',
    light: 'var(--accentColor--light)',
  },
  sites: {
    dark: 'var(--extraColor1)',
    light: 'var(--extraColor1--light)',
  },
  routes: {
    dark: 'var(--extraColor2)',
    light: 'var(--extraColor2--light)',
  },
  users: {
    dark: 'var(--extraColor3)',
    light: 'var(--extraColor3--light)',
  },
};

/**
 * Icons for different categories
 */
const icons = {
  campaigns: <MdTune style={{ color: colors.campaigns.dark }}/>,
  verticals: <MdLayers style={{ color: colors.verticals.dark }}/>,
  fields: <MdList style={{ color: colors.fields.dark }}/>,
  sites: <MdDesktopMac style={{ color: colors.sites.dark }}/>,
  routes: <MdCallSplit style={{ color: colors.routes.dark }}/>,
  users: <MdPeople style={{ color: colors.users.dark }}/>,
};

// TODO: remove
const activities = [
  {
    icon: icons.verticals,
    color: colors.verticals.light,
    action: 'create' as 'create' | 'update' | 'delete',
    name: 'Agency',
    category: 'Verticals',
    link: '/verticals/1',
    date: new Date(),
    editor: 'Rob Rule',
  },
  {
    icon: icons.fields,
    color: colors.fields.light,
    action: 'update' as 'create' | 'update' | 'delete',
    name: 'field_id',
    category: 'Fields',
    link: '/fields/1',
    date: new Date(),
    editor: 'Kyle Walsh',
  },
  {
    icon: icons.sites,
    color: colors.sites.light,
    action: 'delete' as 'create' | 'update' | 'delete',
    name: 'Asbestos.com',
    category: 'Sites',
    link: '/sites/1',
    date: new Date(),
    editor: 'Seanald McDonald',
  },
];