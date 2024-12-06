import React from 'react';
import { CampaignDetails } from './components';
import { Switch, Route } from 'react-router-dom';
import { CampaignsTable } from '../../subpages';
import './Campaigns.scss';

/**
 * The campaigns page
 */
export const Campaigns = () => {
  return (
    <div className='full-container'>
      <Switch>
        {/* Default campaigns route (just show all campaigns) */}
        <Route
          exact
          path='/campaigns'
          render={() => 
            <CampaignsTable />
          }
        />

        {/* Show navigation relating to individual campaigns once one is selected */}
        <Route
          path='/campaigns/:id'
          component={CampaignDetails}
        />

        </Switch>
    </div>
  );
};