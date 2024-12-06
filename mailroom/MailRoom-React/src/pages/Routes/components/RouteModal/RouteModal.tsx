import React, { Fragment, useState, useEffect } from 'react';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
import { DataModal, Input, Button, TextArea, Label, ErrorText, SelectList } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import './RouteModal.scss';

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
 * The modal for routes data
 */
const RouteModalBase = (props: IProps & RouteComponentProps<any>) => {
  // Extract route params to figure out which item is being modified or created
  const id = props.match.params.id;
  options.id = id;
  
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('routes', JSON.parse(JSON.stringify(options)));
  // Fetch route endpoint maps
  const [mapsLoading, mapsData, setMapsData] = useAPI('route_endpoint_maps', { queryParams: `routeId=${id}` });
  // Format and then track which endpoints are selected for the route
  const [endpointSelections, setEndpointSelections] = useState<{ value: number, id: number, error?: string }[]>([]);
  // Count to uniquely track selections
  const [count, setCount] = useState(0);
  // Track original data object (if we're editing an endpoint we'll have to do some cleanup)
  const [originalEndpoints, setOriginalEndpoints] = useState<any>(undefined);
  // Track whether we have set the original data yet
  const [originalSet, setOriginalSet] = useState(false);
  // Fetch endpoint options
  const [endpointsLoading, endpointsData] = useAPI('endpoints');
  // Endpoint options to feed to selects
  const [endpointOptions, setEndpointOptions] = useState<{ label: string, value: number }[]>([]);
  // Track whether we've formatted our endpoint options
  const [endpointsSet, setEndpointsSet] = useState(false);
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);

  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? 'Manage Route' : 'View Route';

  /**
   * Set original data once we have retrieved the data from the endpoint
   */
  useEffect(() => {
    // Track original data retrieved from api to use for cleanup later
    if (!originalSet && !mapsLoading) {
      // Set the original endpoint data so we can update the db on save
      setOriginalSet(true);
      setOriginalEndpoints(mapsData);
    }
  }, [mapsLoading]);

  /**
   * Generate our endpoint selections based on current mappings
   */
  useEffect(() => {
    if (!mapsLoading && endpointsSet) {
      let newCount = 0;
      const selections: { value: number, id: number, error?: string }[] = [];
      
      // Store endpoint ids
      mapsData.forEach((map: any) => {
        selections.push({
          id: newCount++,
          value: map.endpointId,
        });
      });

      // Don't push a blank row if this is a normal user (they can't add rows anyways)
      if (UserStore.user && UserStore.user.isAdmin) {
        // Add a blank row
        selections.push({
          id: newCount++,
          value: -1,
        });
      }

      setCount(newCount);
      setEndpointSelections(selections);
    }
  }, [mapsLoading, endpointsSet]);

  /**
   * Generate endpoint options after retrieving the data
   */
  useEffect(() => {
    if (!endpointsLoading) {
      const options: { label: string, value: number }[] = [];
      
      // Store correctly formatted option
      endpointsData.forEach((endpoint: any) => {
        options.push({
          label: endpoint.name,
          value: endpoint.id,
        });
      });

      // Sort options to be alphabetical
      options.sort((a, b) => (a.label > b.label) ? 1 : ((b.label > a.label) ? -1 : 0)); 

      setEndpointOptions(options);
      setEndpointsSet(true);
    }
  }, [endpointsLoading]);

  /**
   * Validate and then query the api using the new data
   */
  const query = async() => {
    console.log('Querying api');

    // Start by validating fields
    const valid = validateData(endpointSelections);
    // Mark the fact that we've submitted the form at least once
    if (!submitted) setSubmitted(true);

    // If the data was valid, query the api
    if (valid) {
      console.log('valid');

      // Perform actions asynchronously
      const promises: Promise<any>[] = [];

      // Delete any mappings that were removed
      originalEndpoints.forEach((endpoint: any) => {
        const index = endpointSelections.findIndex((e: any) => e.value === endpoint.endpointId);
        // If item is contained in original, but not new, it needs to be deleted
        if (index === -1) {
          // Delete item in DB
          promises.push(queryAPI('DELETE', {
            route: 'route_endpoint_maps',
            id: endpoint.id,
          }));
        }
      });

      // Create mappings that were added
      endpointSelections.forEach((endpoint: any) => {
        // For any non blank endpoints, check if we need to add an item to DB
        if (endpoint.value !== -1) {
          const index = originalEndpoints.findIndex((e: any) => e.endpointId === endpoint.value);
          // If item is contained in original, but not new, it needs to be deleted
          if (index === -1) {
            // Add item in DB
            promises.push(queryAPI('POST', {
              route: 'route_endpoint_maps',
              data: {
                routeId: data.id,
                endpointId: endpoint.value,
              },
            }));
          }
        }
      });

      // Wait for all queries to resolve
      const results = await Promise.all(promises);

      // Determine if we had any errors
      let error = false;
      results.forEach((result) => {
        if (result && result.error) error = true;
      });

      // If there were no errors, show a success message and navigate back
      if (!error) {
        NotificationStore.addNotification(
          'success',
          `${data.name} was successfully ${id === 'add' ? 'added' : 'edited.'}`,
          `Success`,
          2000,
        );
        props.navigateBack(true);
      }
    }
  };

  /**
   * Function to validate the data
   * @param selections - the selections to validate
   * @param passive - whether to passively update the data (no error messages)
   * 
   * @returns
   * @param {boolean} valid - whether data was valid
   */
  const validateData = (selections: any, passive?: boolean) => {
    const errors: any = {};
    // Initialize new selections array in case values change
    const updatedSelections = selections.slice();
    // Remove last blank value
    updatedSelections.pop();
    // Track which errors occur
    const alreadyMapped: any = {};
    let duplicateFound = false;
    let blankFound = false;

    // Validate different fields
    updatedSelections.forEach((selection: any) => {
      // Look for blank values
      if (selection.value === -1) {
        selection.error = 'Field cannot be empty.';
        blankFound = true;
      }
      // Look for duplicate values
      else {
        // If there is a duplicate value
        if (alreadyMapped[selection.value]) {
          selection.error = 'This endpoint already exists.';
          duplicateFound = true;
        }
        // Remove any errors if we didn't find any
        else {
          delete selection.error;
        }
        alreadyMapped[selection.value] = true;
      }
    });

    // Set overall error message
    errors.selections = `${duplicateFound ? 
      'Your endpoint selections contain at least one endpoint that appears twice (should only appear once)' : ''}` +
      `${duplicateFound && blankFound ? '. ' : ''}` +
      `${blankFound ? 'Your endpoint selections should not contain any blank entries' : ''}`;
    
    // If we don't find any errors, remove the selections errors
    if (!errors.selections) delete errors.selections;

    // Set any errors
    setErrors(errors);

    // Readd the blank row at the end of the selections
    updatedSelections.push({
      id: count,
      value: -1,
    });
    // Update selections
    setCount(count + 1);
    setEndpointSelections(updatedSelections);

    // Set any errors that occurred (if we are submitting the form)
    if (!passive && !Validate.empty(errors)) {
      NotificationStore.addNotification('error', 'Please fix any fields with errors and try again.', 'Field Errors', 2000);
      return false;
    }

    return true;
  };

  /**
   * Function used to delete a row of data in the selections list
   * @param index - which row to delete
   */
  const deleteRow = (index: number) => {
    const newSelections = endpointSelections.slice();

    newSelections.splice(index, 1);

    setEndpointSelections(newSelections);

    // Revalidate data after change if we previously had an error
    if (submitted) {
      validateData(newSelections, true);
    }
  };

  /**
   * Add a new row to the end of the selections list
   */
  const addRow = () => {
    const newSelections = endpointSelections.slice();
    newSelections.push({
      id: count,
      value: -1,
    });

    setCount(count + 1);
    setEndpointSelections(newSelections);
  };

  /**
   * Update a rows in the selection list
   */
  const updateRow = (index: number, value: number) => {
    const newSelections = endpointSelections.slice();
    newSelections[index].value = value;
    setEndpointSelections(newSelections);

    // Revalidate data after change if we previously had an error
    if (submitted) {
      validateData(newSelections, true);
    }
  };

  /**
   * Detail tab for modal
   */
  const detailsTab = () => {
    return (
      <Fragment>

        <div className='row'>
          <div className='column'>
            <Input 
              label='Name'
              value={data.name}
              error={errors.name}
              autoComplete='off'
              disabled
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <TextArea 
              rows={4}
              label='Description'
              value={data.description}
              error={errors.description}
              autoComplete='off'
              disabled
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <div className='input__container'>
              <Label text='Endpoints' required={UserStore.user && UserStore.user.isAdmin}/>
              <div className={`routeModal__mappingContainer input ${errors.selections ? 'error' : ''}`}>
                <SelectList
                  selections={endpointSelections}
                  options={endpointOptions}
                  updateRow={updateRow}
                  addRow={addRow}
                  deleteRow={deleteRow}
                  disabled={UserStore.user && !UserStore.user.isAdmin}
                />
              </div>
              { // Show error message if there are any selection errors
                errors.selections &&
                <ErrorText text={errors.selections}/>
              }
            </div>
          </div>
        </div>

        { // Remove button if user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <div className='row m-0'>
            <Button className='dataModal__button' onClick={() => query()}>Save</Button>
          </div>
        }

      </Fragment>
    );
  };

  return (
    <DataModal
      headerText={headerText}
      loading={loading || mapsLoading || !endpointsSet}
      open={open}
      onClose={closeModal}
      className={`routes__dataModal ${props.className ? props.className : ''}`}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={[{
        title: 'Details',
        body: loading || mapsLoading || !endpointsSet ? undefined : detailsTab(),
      }]}
    />
  );
};

/**
 * The modal for route data
 */
export const RouteModal = withRouter(RouteModalBase);

// HELPERS

/**
 * Options used in API hook (defines id of item to fetch)
 */
const options = {
  apiName: 'homebase',
  id: '',
};