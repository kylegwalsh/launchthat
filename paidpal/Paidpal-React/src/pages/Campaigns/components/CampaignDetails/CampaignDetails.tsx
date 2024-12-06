import React, { Fragment } from 'react';
import { Breadcrumbs, Tabs } from 'lt-components';
import { AdgroupsTable, KeywordsTable, CreativesTable } from '../../../../subpages';
import { Switch, Route, withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
// tslint:disable-next-line: no-submodule-imports
import { FiBriefcase, FiFlag } from 'react-icons/fi';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import './CampaignDetails.scss';

/**
 * Get row with name details graphql query
 */
const GET_CAMPAIGN_ROW = gql`
  query getRow {
    row(filters: $filters) 
    @rest(type: "CampaignRow", path: "/get-row/?{args}") {
      accountId
      account
      platform
      campaignId
      campaign
    }
  }
`;

/**
 * Handles table selections relating to a specific campaign
 */
const CampaignDetailsBase = (props: RouteComponentProps<any>) => {
  // Extract route params to figure out which item we've selected
  const id = props.match.params.id;
  console.log(id);

  // Figure out which page we're on
  const activePage = determineActive();

  // Figure out the names of the current item we're looking at (more legible)
  const { data, loading, error } = useQuery(GET_CAMPAIGN_ROW, {
    variables: {
      filters: JSON.stringify({ campaignId: id }),
    },
  });

  return (
    <Fragment>

      {/* Breadcrumb area */}
      <div className='breadcrumbs__wrapper'>
        {/* When we're done loading, render the breadcrumbs */}
        { !loading &&
          <>
            { // Render an error if there was a problem getting the details using the URL id
              (error || !data.row || !data.row.campaignId) ?
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
                      path: `/accounts/${data.row.accountId}/campaigns`,
                    },
                    {
                      icon: FiFlag,
                      text: data.row.campaign,
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
            path: `/campaigns/${id}/adgroups`,
            text: 'Adgroups',
            active: activePage.adgroups,
          },
          {
            path: `/campaigns/${id}/keywords`,
            text: 'Keywords',
            active: activePage.keywords,
          },
          {
            path: `/campaigns/${id}/creatives`,
            text: 'Creatives',
            active: activePage.creatives,
          },
        ]}
      />

      <Switch>

        {/* Route to view adgroups within the campaign */}
        <Route
          exact
          path='/campaigns/:id/adgroups'
          render={() => 
            <AdgroupsTable filters={{ campaignId: id }} />
          }
        />

        {/* Route to view keywords within the campaign */}
        <Route
          exact
          path='/campaigns/:id/keywords'
          render={() => 
            <KeywordsTable filters={{ campaignId: id }} />
          }
        />

        {/* Route to view creatives within the campaign */}
        <Route
          exact
          path='/campaigns/:id/creatives'
          render={() => 
            <CreativesTable filters={{ campaignId: id }} />
          }
        />

        {/* Redirect any incorrect paths to the first route */}
        <Redirect from='*' to={`/campaigns/${id}/adgroups`} />

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
 * Handles table selections relating to a specific campaign
 */
export const CampaignDetails = withRouter(CampaignDetailsBase);