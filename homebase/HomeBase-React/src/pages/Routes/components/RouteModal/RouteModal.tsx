import React, { Fragment, useState, useEffect, useRef } from 'react';
import { DataModal, Input, Button, TextArea, FieldMapList, Label } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
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
  const fieldMapRef = useRef<FieldMapList>(null);
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Track when the submission is processing
  const [processing, setProcessing] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI] = useAPI('routes', JSON.parse(JSON.stringify(options)));
  // Get the approved fields for use in setting route field maps
  const [approvedLoading, approvedData, setApprovedData] = useAPI('fields', JSON.parse(JSON.stringify(approvedOptions)));
  // Fetch data for the route fields
  const [rfLoading, rfData] = useAPI('route_fields', { queryParams: `routeId=${id}` });
  // The map that is the first map to come in
  const [originalMap, setOriginalMap] = useState<any>([]);
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);
  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? (id === 'add' ? 'New Route' : 'Edit Route') : 'View Route';
  // Variable to check to see if we need to reset the field map
  const [resetFieldMap, setResetFieldMap] = useState(false);
  // Get the campaign attributions associated with the route
  const [ caLoading, caData] = useAPI('campaign_attributions', { queryParams: `routeId=${id}` });

  const [ campaignLoading, campaignData ] = useAPI('campaigns');
  // Create an object to house the campaigns
  const [ campaigns, setCampaigns] = useState<any>(undefined);

  /**
   * A function used to set the campaigns that might be modified when modifying the route field
   */
  const getCampaignsAssociatedWithRoute = async () => {
    const campaigns = [];
    for (const ca of caData) {
      for (const campaign of campaignData) {
        if (campaign.id === ca.campaignId) campaigns.push(campaign);
      }
    }
    setCampaigns(campaigns);
  };

  /**
   * Initialize the field map data when we finish loading the first time
   */
  useEffect(() => {
    if (!loading && !approvedLoading && !submitted && !rfLoading && !caLoading && !campaignLoading) {
      // Format approved fields data
      console.log('route field: ', rfData);
      if (campaigns === undefined) {
        getCampaignsAssociatedWithRoute();
      }

      const approvedFields: any[] = [];
      approvedData.forEach((field: any) => {
        approvedFields.push({
          id: field.id,
          label: field.name,
          value: field.name,
        });
      });
      // Initialize the field map
      setApprovedData(approvedFields);
      const fieldMap = createFieldMap(); 
      setOriginalMap(fieldMap);
      if (fieldMapRef.current) fieldMapRef.current.initFieldMap(fieldMap);
    }
  }, [loading, approvedLoading, rfLoading, caLoading, campaignLoading]);

  /**
   * Reset field map if submission fails
   */
  useEffect(() => {
    if (!loading && resetFieldMap) {
      if (fieldMapRef.current) {
        fieldMapRef.current.initFieldMap(data.fieldMap);
      }
      setResetFieldMap(false);
    }
  }, [resetFieldMap, loading]);

  useEffect(() => {
    // Revalidate data after change if we previously had an error
    if (submitted && !data.internalEmail) validateData(data, setErrors, true, errors);
  }, [data]);

  /**
   * Create a field map from the route field data that we retrieve
   */
  const createFieldMap = () => {
    const fieldMap = [];
    for (const routeField of rfData) {
      for (const field of approvedData) {
        if (field.id === routeField.fieldId) fieldMap.push({ id: routeField.id, target: field.name, output: routeField.value }); 
      }
    }
    return fieldMap;
  };

  /**
   * A function used for filtering through the field map and determining differences
   * @param otherArray - The other field map array to compare the field map to
   */
  const comparerFieldMaps = (otherArray: any) => {
    return (current: any) => {
      return otherArray.filter((other: any) => {
        return other.target === current.target;
      }).length === 0;
    };
  };

  /**
   * A function to map back to the id of the route field
   * @param field - The desired field to map back to the correct id for updates/deletes
   */
  const mapBackToRouteFieldId = (field: any) => {
    for (const approvedField of approvedData) {
      if (field.target === approvedField.label) {
        for (const routeField of rfData) {
          if (routeField.fieldId === approvedField.id) return routeField.id;
        }
      }
    }
  };

  /**
   * A function used for creating the route fields
   * @param fieldMap - The field map for the route which needs to create a route fields
   */
  const createRouteFields = (fieldMap: any, routeId: number) => {
    const routeFields = [];

    const deletedFields = originalMap.filter(comparerFieldMaps(fieldMap));
    const addedFields = fieldMap.filter(comparerFieldMaps(originalMap));
    const updatedFields = [];
    const noLongerBlankFields = [];

    // Loop through original fields
    for (const originalField of originalMap) {
      for (const field of fieldMap) {
        // See if output has changed for the original field
        if (field.target === originalField.target && field.output !== originalField.output) {
          updatedFields.push(field);
          // See if the field was previously blank (need to delete campaign attribution fields if it's been set)
          if (originalField.output === '') noLongerBlankFields.push(mapBackToRouteFieldId(field));
        }
      }
    }

    // Denote which fields need to be added in our field map (id = add)
    for (const field of addedFields) {
      for (const approvedField of approvedData) {
        const routeField =
          { id: 'add', value: field.output, fieldId: parseInt(approvedField.id, 10), routeId, name: field.target };
        if (field.target === approvedField.value) routeFields.push(routeField);
      }
    }

    // Denote which fields need to be deleted in our field map (value = delete)
    for (const field of deletedFields) {
      const routeField = { id: mapBackToRouteFieldId(field), value: 'delete', name: field.target };
      routeFields.push(routeField);
    }

    // Denote which fields need to be updated (just stuff them in with their original ids)
    for (const field of updatedFields) {
      for (const approvedField of approvedData) {
        const routeField = { 
          id: mapBackToRouteFieldId(field),
          value: field.output, 
          fieldId: parseInt(approvedField.id, 10), 
          routeId,
          name: field.target,
        };
        if (field.target === approvedField.value) routeFields.push(routeField);
      }
    }

    // Return our route fields and any fields that are no longer blank that must be deleted from campaigns
    return {
      routeFields,
      noLongerBlankFields,
    };
  };

  /**
   * Validate and then query the api using the new data
   */
  const query = async() => {
    setProcessing(true);
    console.log('Querying api');
    // Retrieve field map from fieldMapList component
    let fieldMap = null;
    if (fieldMapRef.current) fieldMap = fieldMapRef.current.retrieveFieldMap();
    const fetchedData = { name: data.name, description: data.description, fieldMap };
    
    // Start by validating fields
    const valid = validateData(fetchedData, setErrors);
    // Mark the fact that we've submitted the form at least once
    if (!submitted) setSubmitted(true);
    
    // If the data was valid, query the api
    if (valid) {
      // We are either creating a new object or updating one
      const routeResult = await queryAPI(id === 'add' ? 'POST' : 'PUT', {
        id: id === 'add' ? undefined : id,
        data,
      });
      console.log(routeResult);

      // If there was an error then let the user know which route field the error came from
      if (routeResult && routeResult.error) {
        NotificationStore.addNotification(
          'error',
          `Something went wrong ${id === 'add' ? 'adding' : 'updating'} the route`,
          `Error`,
        );
        setData(fetchedData);
        setResetFieldMap(true);
        setProcessing(false);
        return;
      }

      // Get the route fields that we need to update/add/delete
      const { routeFields, noLongerBlankFields } = createRouteFields(fetchedData.fieldMap, routeResult.id);

      // Create a promise array to do things asynchronously
      let promises = [];
      // We need to retrieve any campaign details to delete them as well
      const campaignDeletions = [];

      // Track the action that was performed for error reporting
      const actions: {
        fieldType: string;
        action: string;
        name: string;
      }[] = [];
      
      console.log('ROUTE FIELDS', routeFields);
      // Loop over each route field and make API calls based on what we are doing for the route fields
      for (const routeField of routeFields) {
        const fieldName = routeField.name;
        const routeFieldId = routeField.id;
        delete routeField.id;
        delete routeField.name;
        // If the route field value is set to delete, delete the route field
        if (routeField.value === 'delete') {
          promises.push(queryAPI('DELETE', {
            route: 'route_fields',
            id: routeFieldId,
          }));

          // Store action details for error reporting (if necessary)
          actions.push({
            fieldType: 'route',
            action: 'deleting',
            name: fieldName,
          });

          console.log('Deleting', routeField);
        } else {
          // Check if the API call should be a post/put and add or update the route field
          promises.push(queryAPI(routeFieldId === 'add' ? 'POST' : 'PUT', {
            route: 'route_fields',
            id: routeFieldId === 'add' ? undefined : routeFieldId,
            data: routeField,
          }));
          // Store action details for error reporting (if necessary)
          actions.push({
            fieldType: 'route',
            action: routeFieldId === 'add' ? 'adding' : 'updating',
            name: fieldName,
          });
          console.log(routeFieldId === 'add' ? 'Adding' : 'Updating', routeField);
        }
      }

      // Loop over fields that are no longer blank and remove any existing campaign attribution fields associated with them
      for (const fieldId of noLongerBlankFields) {
        promises.push(queryAPI('GET', {
          route: 'campaign_attribution_fields',
          queryParams: `routeFieldId=${fieldId}`,
        }));
        // Store the index so we can delete it afterwards
        campaignDeletions.push(promises.length - 1);
        console.log('FIELD NO LONGER BLANK', fieldId);
      }

      // Wait for all queries to complete
      let results = await Promise.all(promises);
      console.log('RESULTS', results);

      // Loop through results looking for errors before deleting any campaign attribution fields
      for (let i = 0; i < results.length; i++) {
        // If there was an error then let the user know which route field the error came from
        if (results[i] && results[i].error) {
          console.log(`ERROR: Something went wrong ${actions[i].action} the ${actions[i].fieldType} field: ${actions[i].name}`);
          NotificationStore.addNotification(
            'error',
            `Something went wrong ${actions[i].action} the ${actions[i].fieldType} field: ${actions[i].name}`,
            `Error`,
          );
          setData(fetchedData);
          setResetFieldMap(true);
          setProcessing(false);
          return;
        }
      }

      // If we need to delete a campaign attribution field, run this logic
      if (campaignDeletions.length) {
        console.log('CAMPAIGN DELETIONS', campaignDeletions);
        // Reset our promises
        promises = [];

        // Delete any necessary campaign attribution fields (stored in our results array)
        for (const campaignIndex of campaignDeletions) {
          console.log('Deleted campaign', results[campaignIndex]);
          if (results[campaignIndex].length) {
            console.log('Deleting campaign attribution field', results[campaignIndex][0].id);
            promises.push(queryAPI('DELETE', {
              route: 'campaign_attribution_fields',
              id: results[campaignIndex][0].id,
            }));
            console.log('Deleting campaign attribution field', results[campaignIndex][0].id);
          }
        }

        // Grab results from campaign attribution field deletions
        results = await Promise.all(promises);
        console.log('RESULTS 2', results);

        // Loop through results looking for errors deleting campaign attribution fields
        for (let i = 0; i < results.length; i++) {
          // If there was an error then let the user know which route field the error came from
          if (results[i] && results[i].error) {
            NotificationStore.addNotification(
              'error',
              `Something went wrong ${actions[i].action} the ${actions[i].fieldType} field: ${actions[i].name}`,
              `Error`,
            );
            setData(fetchedData);
            setResetFieldMap(true);
            setProcessing(false);
            return;
          }
        }
      }

      console.log('No errors');

      // If there were NO ERRORS updating the route field then try updating/adding name and/or description
      // Delete the field map from data so we can use it in the API call to route
      delete data.fieldMap;

      // If there were no errors, show a success message and navigate back
      NotificationStore.addNotification(
        'success',
        `${data.name} was successfully ${id === 'add' ? 'added' : 'edited.'}`,
        `Success`,
        2000,
      );
      props.navigateBack(true);
    }

    setProcessing(false);
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
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('name', event.target.value, data, setData)}
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
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('description', event.target.value, data, setData)}
            />
          </div>
        </div>
        <div className='row'>
          <div className='column'>
          <div className='input__container'>
              <Label text='Route Fields'/>
              {
                  (rfData.length !== 0 || (UserStore.user && UserStore.user.isAdmin)) ?
                  <div className={`fieldMapModal__mappingContainer input ${errors.fieldMap ? 'error' : ''}`}>
                      <FieldMapList
                        ref={fieldMapRef}
                        options={approvedData}
                        autofillOff
                        disabled={UserStore.user && !UserStore.user.isAdmin}
                        useCategories={false}
                        errors={errors.fieldMapInputs}
                        labels={{
                          target: 'Fields',
                          output: 'Values',
                        }}
                      />
                  </div>
                  : <p>There's currently no route fields on for this route</p>
              }
              { // If an error is provided, show it
                errors.fieldMap &&
                <label className='input__required'>{errors.fieldMap}</label>
              }
            </div>
          </div>  
        </div>
        {
        // Make sure the user is an admin and there exists campaigns that might be modified
        // before displaying the warning message
        ((UserStore.user && UserStore.user.isAdmin) && (campaigns && campaigns.length !== 0)) &&
        <div className='row'>
          <div className='column'>
            <div className='modifiedCampaigns__routeModal'>
              <div className='row m-0'>
                <p>Keep in mind that modifying the route fields will also modify the route fields in the following campaigns.</p>
              </div>
              <div className='row'>
                <div className='column'>
                  <ul>
                    {
                    campaigns.map((campaign: any, index: number) => {
                      return (
                        <li key={index}>
                        <a target='_blank' href={`${window.location.origin}/campaigns/${campaign.id}`}>
                          {campaign.name}
                        </a>
                      </li>
                      );
                    },
                    )
                    }
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        }
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
      loading={loading || rfLoading || approvedLoading || processing || caLoading}
      open={open}
      onClose={closeModal}
      className={`routes__dataModal ${props.className ? props.className : ''}`}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={[{
        title: 'Details',
        body: loading || rfLoading || approvedLoading || processing ? undefined : detailsTab(),
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
 * Function to update a property of the data
 * @param field - the field name to update
 * @param value - the value to update the field with
 * @param data - the original data object
 * @param setData - the function to update the data
 * @param submitted - whether the form has already been submitted once
 */
const updateField = (field: string, value: any, data: any, setData: any) => {
  setData({ ...data, [field]: value });
};

/**
 * Function to validate the data
 * @param data - the data to validate
 * @param setErrors - function to set the error state
 * @param passive - whether to passively update the data (no error messages)
 * 
 * @returns
 * @param {boolean} valid - whether data was valid
 */
const validateData = (data: any, setErrors: any, passive?: boolean, prevErrors?: any) => {
  const errors: any = {};
  errors.fieldMapInputs = {};

  // Never validate field map passively
  if (!passive) {
    errors.fieldMap = '';
    
    // Track different error types
    const errorTypes: any = {};
    // We need to check each map (none should be mapped twice or be blank)
    const alreadyMapped: any = {};
    data.fieldMap.forEach((map: any) => {
      // Check for empty mapping
      if (!map.target) {
        if (!map.target) {
          if (!errors.fieldMapInputs[map.id]) errors.fieldMapInputs[map.id] = {};
          errors.fieldMapInputs[map.id].target = 'Field cannot be empty';
          errorTypes.empty = true;
        }
      }
      else {
        // Check for duplicate mapping
        if (alreadyMapped[map.target]) {
          if (!errors.fieldMapInputs[map.id]) errors.fieldMapInputs[map.id] = {};
          errors.fieldMapInputs[map.id].target = 'This input already exists.';
          errorTypes.duplicate = true;
        }
        else alreadyMapped[map.target] = true;
      }
    });

    // Set error messages
    if (errorTypes.duplicate) {
      errors.fieldMap += `Your field map has at least one input that appears twice (should only appear once)`;
    }
    if (errorTypes.empty) {
      errors.fieldMap += `${errors.fieldMap ? '. ' : ''}` + 
      `Your field map should not contain any blank fields`;
    }
    // Note that validation will only run 
    if (errors.fieldMap) {
      errors.fieldMap += `. The field map will only be re-validated when you try to save`;
    }
    if (!errors.fieldMap) {
      delete errors.fieldMapInputs;
      delete errors.fieldMap;
    }
  }
// Keep old field map errors if passive
  else {
    errors.fieldMap = prevErrors.fieldMap;
    errors.fieldMapInputs = prevErrors.fieldMapInputs;
  }

  // Validate different fields
  if (!data.name) errors.name = 'Name cannot be blank';

  if (!data.description) errors.description = 'Description cannot be blank';

  setErrors(errors);

  // Set any errors that occurred (if we are submitting the form)
  if (!passive && !Validate.empty(errors)) {
    NotificationStore.addNotification('error', 'Please fix any fields with errors and try again.', 'Field Errors', 2000);
    return false;
  }

  return true;
};

/**
 * Options used in API hook (defines id of item to fetch and an empty representation of the object in case we're adding it)
 */
const options = {
  id: '',
  emptyObj: {
    name: '',
    description: '',
  },
};

/**
 * Options used to retrieve approved fields from API hook
 */
const approvedOptions = {
  apiName: 'homebase',
  queryParams: 'order[name]=asc',
};