import React, { Fragment } from 'react';
import { Breadcrumbs, Tabs } from 'lt-components';
import { CampaignsTable, AdgroupsTable, KeywordsTable, CreativesTable } from '../../../../subpages';
import { Switch, Route, withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
// tslint:disable-next-line: no-submodule-imports
import { FiBriefcase } from 'react-icons/fi';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import './AccountDetails.scss';

/**
 * Get row with name details graphql query
 */
const GET_ACCOUNT_ROW = gql`
  query getRow {
    row(filters: $filters) 
    @rest(type: "AccountRow", path: "/get-row/?{args}") {
      accountId
      account
      platform
    }
  }
`;

/**
 * Handles table selections relating to a specific account
 */
const AccountDetailsBase = (props: RouteComponentProps<any>) => {
  // Extract route params to figure out which item we've selected
  const id = props.match.params.id;
  console.log(id);

  // Figure out which page we're on
  const activePage = determineActive();

  // Figure out the names of the current item we're looking at (more legible)
  const { data, loading, error } = useQuery(GET_ACCOUNT_ROW, {
    variables: {
      filters: JSON.stringify({ accountId: id }),
    },
  });
  console.log('NAME DATA', data);

  return (
    <Fragment>

      {/* Breadcrumb area */}
      <div className='breadcrumbs__wrapper'>
        {/* When we're done loading, render the breadcrumbs */}
        { !loading &&
          <>
            { // Render an error if there was a problem getting the details using the URL id
              (error || !data.row || !data.row.accountId) ?
              // Render error if it exists
              (
                <span className='breadcrumbs__error'>{ error ? error.message : 'Bad ID provided' }</span>
              ) :
              // Otherwise, render normal breadcrumbs
              (
                <Breadcrumbs
                  pages={loading ? [] : [
                    {
                      icon: FiBriefcase,
                      text: `${data.row.account} - ${data.row.platform}`,
                    },
                  ]}
                />
              )
            }
          </>
        }
      </div>

      <Tabs
        className={{ container: 'tabMargin' }}
        tabs={[
          {
            path: `/accounts/${id}/campaigns`,
            text: 'Campaigns',
            active: activePage.campaigns,
          },
          {
            path: `/accounts/${id}/adgroups`,
            text: 'Adgroups',
            active: activePage.adgroups,
          },
          {
            path: `/accounts/${id}/keywords`,
            text: 'Keywords',
            active: activePage.keywords,
          },
          {
            path: `/accounts/${id}/creatives`,
            text: 'Creatives',
            active: activePage.creatives,
          },
        ]}
      />

      <Switch>

        {/* Route to view campaigns within the account */}
        <Route
          exact
          path='/accounts/:id/campaigns'
          render={() => 
            <CampaignsTable filters={{ accountId: id }} />
          }
        />

        {/* Route to view campaigns within the account */}
        <Route
          exact
          path='/accounts/:id/adgroups'
          render={() => 
            <AdgroupsTable filters={{ accountId: id }} />
          }
        />

        {/* Route to view campaigns within the account */}
        <Route
          exact
          path='/accounts/:id/keywords'
          render={() => 
            <KeywordsTable filters={{ accountId: id }} />
          }
        />

        {/* Route to view campaigns within the account */}
        <Route
          exact
          path='/accounts/:id/creatives'
          render={() => 
            <CreativesTable filters={{ accountId: id }} />
          }
        />

        {/* Redirect any incorrect paths to the first route */}
        <Redirect from='*' to={`/accounts/${id}/campaigns`} />

      </Switch>

    </Fragment>
  );
};

/**
 * Determine which page is currently active
 */
const determineActive = () => {
  const pageArr = location.pathname.split('/');
  const pageName = pageArr[pageArr.length - 1];

  return {
    [pageName]: true,
  };
};

/**
 * Handles table selections relating to a specific account
 */
export const AccountDetails = withRouter(AccountDetailsBase);