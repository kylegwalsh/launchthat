import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AdgroupDetails } from './components';
import { AdgroupsTable } from '../../subpages';
import './Adgroups.scss';

/**
 * The adgroups page
 */
export const Adgroups = () => {
  return (
    <div className='full-container'>
      <Switch>
        {/* Default adgroups route (just show all adgroups) */}
        <Route
          exact
          path='/adgroups'
          render={() => 
            <AdgroupsTable />
          }
        />

        {/* Show navigation relating to individual adgroups once one is selected */}
        <Route
          path='/adgroups/:id'
          component={AdgroupDetails}
        />

      </Switch>
    </div>
  );
};