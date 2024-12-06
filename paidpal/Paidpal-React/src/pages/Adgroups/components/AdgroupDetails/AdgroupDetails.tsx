import React, { Fragment } from 'react';
import { Breadcrumbs, Tabs } from 'lt-components';
import { KeywordsTable, CreativesTable } from '../../../../subpages';
import { Switch, Route, withRouter, Redirect, RouteComponentProps } from 'react-router-dom';
// tslint:disable-next-line: no-submodule-imports
import { FiBriefcase, FiFlag, FiFolder } from 'react-icons/fi';
import gql from 'graphql-tag';
import { useQuery } from 'react-apollo-hooks';
import './AdgroupDetails.scss';

/**
 * Get row with name details graphql query
 */
const GET_ADGROUP_ROW = gql`
  query getRow {
    row(filters: $filters) 
    @rest(type: "AdgroupRow", path: "/get-row/?{args}") {
      accountId
      account
      platform
      campaignId
      campaign
      adgroupId
      adgroup
    }
  }
`;

/**
 * Handles table selections relating to a specific adgroup
 */
const AdgroupDetailsBase = (props: RouteComponentProps<any>) => {
  // Extract route params to figure out which item we've selected
  const id = props.match.params.id;
  console.log(id);

  // Figure out which page we're on
  const activePage = determineActive();

  // Figure out the names of the current item we're looking at (more legible)
  const { data, loading, error } = useQuery(GET_ADGROUP_ROW, {
    variables: {
      filters: JSON.stringify({ adgroupId: id }),
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
              (error || !data.row || !data.row.adgroupId) ?
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
                      // TODO: Include account id
                      path: `/accounts/${data.row.accountId}/campaigns`,
                    },
                    {
                      icon: FiFlag,
                      text: data.row.campaign,
                      // TODO: Include campaign id
                      path: `/campaigns/${data.row.campaignId}/adgroups`,
                    },
                    {
                      icon: FiFolder,
                      text: data.row.adgroup,
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
            path: `/adgroups/${id}/keywords`,
            text: 'Keywords',
            active: activePage.keywords,
          },
          {
            path: `/adgroups/${id}/creatives`,
            text: 'Creatives',
            active: activePage.creatives,
          },
        ]}
      />

      <Switch>

        {/* Route to view keywords within the campaign */}
        <Route
          exact
          path='/adgroups/:id/keywords'
          render={() => 
            <KeywordsTable filters={{ adgroupId: id }} />
          }
        />

        {/* Route to view creatives within the campaign */}
        <Route
          exact
          path='/adgroups/:id/creatives'
          render={() => 
            <CreativesTable filters={{ adgroupId: id }} />
          }
        />

        {/* Redirect any incorrect paths to the first route */}
        <Redirect from='*' to={`/adgroups/${id}/keywords`} />

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
 * Handles table selections relating to a specific adgroup
 */
export const AdgroupDetails = withRouter(AdgroupDetailsBase);