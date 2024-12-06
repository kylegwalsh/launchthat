import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { AccountDetails } from './components';
import { AccountsTable } from '../../subpages';
import './Accounts.scss';

/**
 * The accounts page
 */
export const Accounts = () => {
  return (
    <div className='full-container'>
      <Switch>

        {/* Default accounts route (just show all accounts) */}
        <Route
          exact
          path='/accounts'
          render={() => 
            <AccountsTable />
          }
        />

        {/* Show navigation relating to individual accounts once one is selected */}
        <Route
          path='/accounts/:id'
          component={AccountDetails}
        />

      </Switch>
    </div>
  );
};