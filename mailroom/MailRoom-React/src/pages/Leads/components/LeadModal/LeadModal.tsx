import React, { Fragment, useState, useEffect } from 'react';
import { DataModal, Input, Select, Button, CheckboxList, Label, JSONView, ProgressBar, Chip } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Format } from '../../../../utilities';
import { UserStore } from '../../../../stores';
import './LeadModal.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * function to run when modal is being closed to navigate back to the page
   */
  navigateBack: (...args: any[]) => void;
}

/** 
 * The modal for lead data
 */
const LeadModalBase = (props: IProps & RouteComponentProps<any>) => {
  // Extract field params to figure out which item is being modified or created
  const id = props.match.params.id;
  
  // Track selected version of lead
  const [version, setVersion] = useState(props.match.params.version ? parseInt(props.match.params.version, 10) : 1);
  
  // Format query ID for endpoints
  const queryID = `id=${id};version=${version}`;

  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('leads', { id: queryID });
  // Retrieve response records from DB and their corresponding endpoint names
  const [rrLoading, rrData, setRrData, rr1, rr2, queryRrAPI, refreshRrData] = 
    useAPI('response_records', { queryParams: `leadId=${id}&leadVersion=${version}` });
  // Retrieve all endpoints from DB to see which endpoints correspond to response records
  const [endpointsLoading, endpointsData] = useAPI('endpoints', { queryParams: `properties[]=id&properties[]=name` });
  // Track actual endpoint records and hold onto data used to refire
  const [refireObj, setRefireObj]: any[] = useState();
  // Track refire selections and show statuses
  const [endpointSelection, setEndpointSelection] = useState<{
    checked: boolean;
    value: string;
    label: string;
    chip: {
      type: 'success' | 'warning' | 'danger' | 'default';
      label: string;
    };
    row?: React.ReactNode;
  }[]>([]);
  // Fetch names of correct route, site, and vertical to show in UI
  const [names, setNames]: any = useState({});
  // Store route endpoint maps for refresh during refire
  const [routeEndpointMaps, setRouteEndpointMaps]: any = useState({});
  // Track when we finish setup
  const [setupComplete, setSetupComplete] = useState(false);
  const [setupStarted, setSetupStarted] = useState(false);
  // Manage progress bar during refires
  const [firing, setFiring] = useState(false);
  const [firingPercent, setFiringPercent] = useState(0);
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);
  // Different versions available for this lead
  const [versionOptions, setVersionOptions] = useState<{ label: string; value: string; }[]>([]);
  // Track when options are finished generating
  const [versionOptionsSet, setVersionOptionsSet] = useState(false);
  // Track when version has changed
  const [versionChanged, setVersionChanged] = useState(false);

  // Set header based on operation being performed (can only view lead)
  const headerText = 'View Lead';

  /**
   * Determine the different version options available when page loads
   */
  useEffect(() => {
    generateVersionOptions();
  }, []);

  /**
   * Query back-end for different leads with the same id (then select versions)
   */
  const generateVersionOptions = async() => {
    console.log('Getting version options');

    const availableVersions: { label: string; value: string; }[] = [];

    // Query different versions of same lead
    const leads = await queryAPI('GET', { route: 'leads', queryParams: `id=${id}` });

    leads.forEach((lead: any) => {
      availableVersions.push({
        label: `Version ${lead.version}`,
        value: lead.version,
      });
    });

    setVersionOptions(availableVersions);
    setVersionOptionsSet(true);
  };

  /**
   * Re-render data when version changes
   */
  useEffect(() => {
    if (versionChanged) {
      console.log('Version changed', version);
      refreshData();
      refreshRrData();
      setSetupComplete(false);
      setSetupStarted(false);
    }
  }, [version]);

  /**
   * Setup respond records
   */
  useEffect(() => {
    // Run setup once loading completes
    if (!loading && data.siteId && !rrLoading && !endpointsLoading && !setupStarted) {
      setSetupStarted(true);
      setup();
    }
  }, [loading, data.siteId, rrLoading, endpointsLoading, setupStarted]);

  /**
   * After we finish getting the lead info, query the respective data types and get their names.
   * Also grab the expected endpoints from the DB 
   */
  const setup = async() => {
    // Maps used to generate options
    let expectedEndpoints: any;
    console.log('Setup is running', data);

    // If we are doing setup for the first time, get all data
    if (!setupComplete) {
      console.log('Fresh setup (query tables)');

      // Create promise array so we can perform queries asynchronously
      const promises = [];

      console.log('Current route', data.routeId);

      // Get names of different db items from ids
      promises.push(queryAPI('GET', { apiName: 'homebase', route: 'sites', queryParams: `id=${data.siteId}` }));
      promises.push(queryAPI('GET', { apiName: 'homebase', route: 'verticals', queryParams: `id=${data.verticalId}` }));
      promises.push(queryAPI('GET', { apiName: 'homebase', route: 'routes', queryParams: `id=${data.routeId}` }));
      // Get expected endpoints from route endpoint maps table
      promises.push(queryAPI('GET', { route: 'route_endpoint_maps', queryParams: `routeId=${data.routeId}` }));

      // Wait for all queries to complete
      const results = await Promise.all(promises);

      // Check for errors
      results.forEach((result) => {
        if (result.error) return;
      });

      // Map names to the correct fields
      setNames({
        site: results[0].length ? results[0][0].name : 'Unknown',
        vertical: results[1].length ? results[1][0].name : 'Unknown',
        route: results[2].length ? results[2][0].name : 'Unknown',
      });

      // Assign our maps so they can be used to generate options below
      setRouteEndpointMaps(results[3]);
      expectedEndpoints = results[3];
    }
    // If this is after a refire, we don't need to fetch any data 
    else {
      console.log('Reusing previous route endpoint maps');
      // Retrieve previous maps so they can be used to generate options below
      expectedEndpoints = routeEndpointMaps;
    }

    // Generate our endpoint selection object and refire object to manage refire selections and necessary data
    const newSelection: {
      checked: boolean;
      value: string;
      label: string;
      chip: {
        type: 'success' | 'warning' | 'danger' | 'default';
        label: string;
      };
      row?: React.ReactNode;
    }[] = [];
    const newRefireObj: { endpointId: number, responseId?: number }[] = [];
    // Keep a count of which index we're on and use that as the key for the newSelection
    let count = 0;

    // Loop through expected endpoints and generate the lists we need
    expectedEndpoints.forEach((expected: any) => {
      const rrIndex = rrData.findIndex((rr: any) => rr.endpointId === expected.endpointId);
      const endpointIndex = endpointsData.findIndex((end: any) => end.id === expected.endpointId);

      // If we found a record that corresponds to the endpoint, attach the status and 
      if (rrIndex !== -1) {
        // Get status fields needed for chip
        const status = getStatus(rrData[rrIndex].statusCode);

        // Store necessary data for refiring later
        newRefireObj.push({
          responseId: rrData[rrIndex].id,
          endpointId: expected.endpointId,
        });

        // Store selection as option in checkboxList
        newSelection.push({
          checked: false,
          value: count.toString(),
          label: endpointsData[endpointIndex] !== -1 ? endpointsData[endpointIndex].name : 'DELETED',
          chip: {
            type: status.type as 'success' | 'warning' | 'danger' | 'default',
            label: status.label,
          },
          row: (
            <JSONView
              className={{
                container: 'leadModal__statusJSON',
              }}
              disabled
              data={rrData[rrIndex].body}
              name={false}
              collapsibleRoot={false}
              displayDataTypes={false}
            />
          ),
        });
      }
      // If there is no response record, the endpoint was not hit
      else {
        // Store necessary data for refiring later
        newRefireObj.push({
          endpointId: expected.endpointId,
        });

        // Store selection as option in checkboxList
        newSelection.push({
          checked: false,
          value: count.toString(),
          label: endpointsData[endpointIndex] !== -1 ? endpointsData[endpointIndex].name : 'DELETED',
          chip: {
            type: 'warning',
            label: 'Unsent',
          },
        });
      }

      // Increment count
      count++;
    });

    // Set states
    setRefireObj(newRefireObj);
    setEndpointSelection(newSelection);
    setSetupComplete(true);
    console.log('Setup complete');
  };

  /**
   * Determine necessary status fields based on status code
   * @param statusCode
   */
  const getStatus = (statusCode: number) => {
    // If we have a good status, return success
    if (statusCode >= 200 && statusCode < 300) {
      return {
        type: 'success',
        label: 'Success',
      };
    }
    // Otherwise, return danger
    else {
      return {
        type: 'danger',
        label: 'Failed',
      };
    }
  };

  /**
   * Get the type for the status chip
   */
  const getType = (status: string) => {
    switch (status) {
    case 'success':
      return 'success';
    case 'failed':
      return 'danger';
    case 'unsent':
      return 'warning';
    default:
      return 'default';
    }
  };

  /**
   * Handle change in endpoint selection for refiring
   * @param value - value of endpoint clicked
   */
  const handleSelectionChange = (value: string) => {
    // Initialize a new selection object
    const newSelection = endpointSelection.slice();
    // Loop through the current values and see which was clicked
    newSelection.forEach((selection) => {
      // Toggle the checked state of the selected option
      if (selection.value === value) selection.checked = !selection.checked;
    });

    setEndpointSelection(newSelection);
  };

  /**
   * Refire endpoints based on endpoint selections
   */
  const refireLead = async() => {
    // Show progress bar
    setFiring(true);

    // Initialize object for DB
    const queryData: any = {
      endpoints: [],
      data: {
        lead_id: data.id,
        lead_version: data.version,
        route: {
          id: data.routeId,
          name: names.route,
        },
        channel: data.channel,
        site_name: names.site,
        created_at: data.createdAt,
        fields: data.fields,
      },
    };

    // Format data for back-end refire endpoint
    for (const selection of endpointSelection) {
      // See which endpoints are selected
      if (selection.checked) {
        // Mark selection as part of query data
        queryData.endpoints.push({
          id: refireObj[selection.value].endpointId,
          responseId: refireObj[selection.value].responseId ? refireObj[selection.value].responseId : undefined,
        });
      }
    }

    // Post to refire endpoint
    const result = await queryAPI('POST', { route: 'refire', data: queryData });

    // If there was an error, abort
    if (result.error) {
      setFiring(false);
      return;
    }

    // Update progress bar
    updateProgress(0);
  };

  /**
   * Update the percentage of the progress bar
   */
  const updateProgress = (percent: number) => {
    // Increase progress bar based on time (10s til refresh)
    if (percent < 100) {
      const newPercent = percent + 1;
      setFiringPercent(newPercent);
      setTimeout(() => updateProgress(newPercent), 100);
    }
    // Otherwise we're done and need to update the data with the new records
    else {
      refreshData();
      refreshRrData();
      setSetupStarted(false);
      setFiring(false);
      setFiringPercent(0);
    }
  };

  /**
   * Check whether an endpoint is selected and we can refire
   */
  const checkFire = () => {
    // If we have an endpoint checked, return true
    for (const selection of endpointSelection) {
      if (selection.checked) return true;
    }

    // If none are checked, return false
    return false;
  };

  /**
   * Reload page with a different version of the lead
   */
  const showDifferentVersion = (newVersion: number) => {
    props.history.push(`/leads/${id}/${newVersion}`);
    setVersionChanged(true);
    setVersion(newVersion);
  };

  /**
   * Detail tab for modal
   */
  const detailsTab = () => {
    return (
      <Fragment>
        { // If we're not refiring endpoints show the normal tab
          !firing &&
          <Fragment>

            <div className='row'>
              <div className='column'>
                <Select
                  label='Lead Version'
                  value={version}
                  options={versionOptions}
                  onChange={(newVersion) => showDifferentVersion(newVersion)}
                  disabled={versionOptions.length === 1}
                />
              </div>
              <div className='column'>
                <Input
                  label='Lead ID'
                  value={data.id}
                  autoComplete='off'
                  disabled
                />
              </div>
            </div>

            <div className='row'>
              <div className='column'>
                <div className='input__container'>
                  <div className='leadModal__statusContainer'>
                    <Label className='leadModal__statusLabel' text='Endpoint Delivery Status'/>
                    <span className={`leadModal__overallStatus`}>
                      <Chip label={Format.titleCase(data.deliveryStatus)} type={getType(data.deliveryStatus)} />
                    </span>
                  </div>
                  <div className={`leadModal__endpointContainer input`}>
                    { // If we have endpoints associated with the route, show their statuses
                      endpointSelection.length > 0 &&
                      <Fragment>
                        <CheckboxList
                          className={{
                            row: 'leadModal__statusRow',
                          }}
                          radioStyle
                          values={endpointSelection}
                          onChange={(event) => handleSelectionChange(event.target.value)}
                        />
                        { // Remove button if user cannot refire anyways
                          UserStore.user && UserStore.user.isAdmin &&
                          <div className='row leadModal__refireButtonRow'>
                            <Button
                              disabled={!checkFire()}
                              onClick={() => refireLead()}
                            >
                              Refire Endpoints
                            </Button>
                          </div>
                        }
                      </Fragment>
                    }
                    { // If we don't have any endpoints associated with the route, state that
                      endpointSelection.length === 0 &&
                      <div className='leadModal__noEndpointsText'>No Associated Endpoints</div>
                    }
                  </div>
                </div>
              </div>
            </div>

            <div className='row'>
              <div className='column'>
                <Input
                  label='Created Date'
                  value={Format.dateTime(new Date(data.createdAt))}
                  autoComplete='off'
                  disabled
                />
              </div>
              <div className='column'>
                <Input 
                  label='Route'
                  disabled
                  value={names.route}
                  autoComplete='off'
                />
              </div>
            </div>
            <div className='row'>
              <div className='column'>
                <Input
                  label='Vertical'
                  disabled
                  value={names.vertical}
                  autoComplete='off'
                />
              </div>
              <div className='column'>
                <Input
                  label='Site'
                  disabled
                  value={names.site}
                  autoComplete='off'
                />
              </div>
            </div>

            <div className='row'>
              <div className='column'>
                <Input
                  label='Channel'
                  disabled
                  value={data.channel}
                  autoComplete='off'
                />
              </div>
              <div className='column'>
                <Input
                  label='Rule Version'
                  value={data.ruleVersion}
                  autoComplete='off'
                  disabled
                />
              </div>
            </div>

            <div className='row'>
              <div className='column leadModal__overflowHidden'>
                <JSONView
                  disabled
                  label='Fields'
                  data={data.fields}
                  name={false}
                  collapsibleRoot={false}
                  displayDataTypes={false}
                />
              </div>
            </div>

          </Fragment>
        }
        { // If we are refiring, show the progress bar
          firing &&
          <div className='leadModal__progressContainer'>
            <strong>Refiring...</strong>
            <ProgressBar percent={firingPercent} caps='round'/>
          </div>
        }

      </Fragment>
    );
  };

  return (
    <DataModal
      headerText={headerText}
      loading={loading || rrLoading || endpointsLoading || !setupComplete || !versionOptionsSet}
      open={open}
      onClose={closeModal}
      className={`leads__dataModal ${props.className ? props.className : ''}`}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={[{
        title: 'Details',
        body: loading || rrLoading || endpointsLoading || !setupComplete || !versionOptionsSet ? undefined : detailsTab(),
      }]}
    />
  );
};

/**
 * The modal for lead data
 */
export const LeadModal = withRouter(LeadModalBase);