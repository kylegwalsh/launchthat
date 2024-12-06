import React, { Fragment, useState, useEffect, useRef } from 'react';
import { DataModal, Input, Button, TextArea, FieldMapList, Label, Select, RadioList, Loading } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
import './CampaignsModal.scss';

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

const CampaignsModalBase = (props: IProps & RouteComponentProps<any>) => {
  // A variable set from UserStore to see if the user is an admin
  const admin = UserStore.user && UserStore.user.isAdmin;

  // Extract route params to figure out which item is being modified or created
  const id = props.match.params.id;
  options.id = id;

  // Create the refs for both of the field maps
  const fieldMapRefDefault = useRef<FieldMapList>(null);
  const fieldMapRefPaid = useRef<FieldMapList>(null);
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI] = useAPI('campaigns', JSON.parse(JSON.stringify(options)));
  // Get the verticals data
  const [verticalLoading, verticalData] = useAPI('verticals');
  // Formatted options for vertical select
  const [verticalOptions, setVerticalOptions] = useState<{ label: string; value: string; }[]>([]);
  // Track when vertical options have been set
  const [verticalOptionsSet, setVerticalOptionsSet] = useState(false);
  // Get the routes data
  const [routesLoading, routesData] = useAPI('routes');
  // Get the approved fields
  const [approvedLoading, approvedData] = useAPI('fields', JSON.parse(JSON.stringify(approvedOptions)));
  // Track when vertical options have been set
  const [approvedOptionsSet, setApprovedOptionsSet] = useState(false);
  // Data for the route fields
  const [rfLoading, rfData] = useAPI('route_fields', JSON.parse(JSON.stringify(approvedOptions)));
  // Check whether the paid route option is selected
  const [paidRoute, setPaidRoute] = useState(false); 
  // Check whether the paid field map is set
  const [paidFieldMapSet, setPaidFieldMapSet] = useState(true);
  // Check whether the default field map is set
  const [defaultFieldMapSet, setDefaultFieldMapSet] = useState(true);
  // Check whether the default field map is empty
  const [defaultMapEmpty, setDefaultMapEmpty] = useState(true);
  // Check whether the paid field map is empty
  const [paidMapEmpty, setPaidMapEmpty] = useState(true);
  // Track open and close of the modal
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);
  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? (id === 'add' ? 'New Campaign' : 'Edit Campaign') : 'View Campaign';
  // Variable to check to see if we need to reset the field map
  const [resetFieldMap, setResetFieldMap] = useState(false);
  // Get the data for the campaigns attributions
  const [campaignAttributionLoading, campaignAttributionData] = useAPI('campaign_attributions', { queryParams: `campaignId=${id}` });
   // Get the data for the campaign attribution fields
  const [campaignFieldsLoading, campaignFieldsData] = useAPI('campaign_attribution_fields');

  /**
   * Initialize the verticals for the selects 
   */
  useEffect(() => {
    if (!verticalLoading && !loading && !verticalOptionsSet) {
      console.log('Generating vertical options');
      const verticals = [];
      
      // Loop through the verticals and make them select friendly
      for (const vertical of verticalData) {
        console.log('Option:', {
          label: vertical.name,
          value: vertical.id,
        });
        verticals.push({
          label: vertical.name,
          value: vertical.id,
        });
      }

      setVerticalOptions(verticals);
      setVerticalOptionsSet(true);
    }
  }, [verticalLoading, loading, verticalOptionsSet]);

  /**
   * A use effect which creates the routes data for the selects
   */
  useEffect(() => {
    if (!routesLoading && !loading && !campaignAttributionLoading) {
      const newData = { ...data };
      // Loop through the attribution and see if there is a paid one
      // then set the proper starting attributions
      for (const attribution of campaignAttributionData) {
        if (attribution.isPaid) {
          setPaidRoute(true);
          if (attribution.routeId) newData.paidRoute = attribution.routeId;
        } else {
          if (attribution.routeId) newData.defaultRoute = attribution.routeId;
        }
      }
      // Loop through the routes and put them in a select friendly format
      const routes = [];
      for (const route of routesData) {
        routes.push({
          label: route.name,
          value: route.id,
        });
      }
      newData.routes = routes;
      setData(newData);
    }
  }, [routesLoading, loading, campaignAttributionLoading]);

  /**
   * Reset field maps if submission fails
   */
  useEffect(() => {
    // On reset create the field map with disabled and reset the maps
    if (!loading && resetFieldMap) {
      if (activeTab && !campaignAttributionLoading && !loading) {
        if (data.paidRoute && paidRoute) {
          const rfData = getRfData(data.paidRoute);
          const fieldMap = createFieldMapReset(rfData, data.fieldMapPaid);
          if (fieldMapRefPaid.current && paidFieldMapSet) fieldMapRefPaid.current.initFieldMap(fieldMap);
        }
        if (data.defaultRoute) {
          const rfData = getRfData(data.defaultRoute);
          const fieldMap = createFieldMapReset(rfData, data.fieldMapDefault);
          if (fieldMapRefDefault.current) fieldMapRefDefault.current.initFieldMap(fieldMap);
        }
      }
      setResetFieldMap(false);
    }
  }, [resetFieldMap, loading]);

  /**
   * Create the field maps on reset (Add in disabled fields)
   * @param rfData - The route field data for the field map
   * @param fieldMap - The field map we update
   */
  const createFieldMapReset = (rfData: any, fieldMap: any) => {
    for (const field of fieldMap) {
      for (const routeField of rfData) {
        if (routeField.fieldId === mapFieldToFieldId(field.target)) {
          field.disabled = { target: true, output: routeField.value.length !== 0 };
        }
      }
    }
    return fieldMap;
  };

  /**
   * Initialize the field map data when we finish loading the first time
   */
  useEffect(() => {
    if (!approvedLoading && !rfLoading && !loading && !approvedOptionsSet) {
      // Format approved fields data
      const newData = { ...data };

      const approvedFields: any[] = [];
      approvedData.forEach((field: any) => {
        approvedFields.push({
          id: field.id,
          label: field.name,
          value: field.name,
        });
      });
      // Set the approved data fields
      // setApprovedData(approvedFields);
      newData.approvedData = approvedFields;
      setData(newData);
      setApprovedOptionsSet(true);
    }      
  }, [approvedLoading, rfLoading, loading, approvedOptionsSet]);

  /**
   * A use effect for creating the initial field maps
   */
  useEffect(() => {
    
    if (activeTab 
      && !campaignAttributionLoading 
      && !loading && !rfLoading && data.approvedData && !approvedLoading && !campaignFieldsLoading) {
      if (data.paidRoute && paidRoute) {
        const fieldMap = getRfDataAndSetMap(data.paidRoute, true);
        if (fieldMapRefPaid.current && paidFieldMapSet) fieldMapRefPaid.current.initFieldMap(fieldMap);
      } 
      if (data.defaultRoute) {
        const fieldMap = getRfDataAndSetMap(data.defaultRoute);
        if (fieldMapRefDefault.current) fieldMapRefDefault.current.initFieldMap(fieldMap);
      }
    } 
  }, [ data, 
    activeTab, data.approvedData, 
    fieldMapRefDefault.current, fieldMapRefPaid.current, 
    paidRoute, campaignAttributionLoading, 
    rfLoading, !campaignFieldsLoading]);

  /**
   * @param routeId - The route that is associated with a field map
   * @param paid - A boolean to determine whether the map your setting is paid
   * Get the route field data for a specific map, the field map and handle setting the map
   * in the UI
   */
  const getRfDataAndSetMap = (routeId: number, paid?: boolean) => {
    const result = getRfData(routeId);
    const fieldMap = !paid ? createFieldMap(result) : createFieldMap(result, true);
    // Check whether the field map is empty and don't display them if they aren't
    if (result.length === 0) {
      setDefaultMapEmpty(true); 
      if (paid) setPaidMapEmpty(true);
    } else {
      setDefaultMapEmpty(false); 
      if (paid) setPaidMapEmpty(false);
    }
    // Set the field maps for when the ref has to reset between route selection
    setDefaultFieldMapSet(true);
    if (paid) setPaidFieldMapSet(true);
    return fieldMap;
  };

  /**
   * @param routeId - The route id for the route field data you wish to acquire
   * Get the route field data for a specific route
   */
  const getRfData = (routeId: number) => {
    const result: any = [];
    for (const routeField of rfData) {
      if (routeField.routeId === routeId) result.push(routeField);
    }
    return result;
  };

  /**
   * @param rfData - The route field data for a specific route
   * @param paid - A boolean to check whether the field map being created is paid
   * Create a field map from the route field data that we retrieve
   */
  const createFieldMap = (rfData: any, paid?: boolean) => {
    const fieldMap = [];
    // Loop through the route field data and find the fields that match that route field ID
    // then push the new values to the field map filling in the value if one exists on the 
    // route field
    for (const routeField of rfData) {
      for (const field of data.approvedData) {
        if (field.id === routeField.fieldId) 
          fieldMap.push(
            { id: routeField.id, 
              target: field.value,
              output: routeField.value, 
              disabled: { target: true, output: routeField.value.length !== 0 },
            });
      }
    }
    // Loop over the previous field maps and set values if there are any campaign specific fields
    if (paid) {
      for (const attribution of campaignAttributionData) {
        if (attribution.isPaid) {
          for (const attributionField of campaignFieldsData) {
            if (attribution.id === attributionField.campaignAttributionId) {
              for (const field of fieldMap) {
                if (field.id === attributionField.routeFieldId) {
                  field.output = attributionField.value;
                }
              } 
            } 
          }
        }
      }
    } else if (!paid) {
      for (const attribution of campaignAttributionData) {
        if (!attribution.isPaid) {
          for (const attributionField of campaignFieldsData) {
            if (attribution.id === attributionField.campaignAttributionId) {
              for (const field of fieldMap) {
                if (field.id === attributionField.routeFieldId) {
                  field.output = attributionField.value;
                }
              } 
            } 
          }
        }
      }
    }

    return fieldMap;
  };

  /**
   * Map the field name or target value to the field ID
   * @param fieldTarget - The fields target value or name
   */
  const mapFieldToFieldId = (fieldTarget: string) => {
    for (const field of data.approvedData) {
      if (fieldTarget === field.label) return field.id;
    }
  };

  /**
   * Map the route id to the route name
   * @param routeId - The id of the route your trying to get the name of
   */
  const mapRouteIdToRouteName = (routeId: number) => {
    for (const route of data.routes) {
      if (route.id === routeId) return route.name;
    }
  };

  /**
   * Loop over the current field map and prior campaign specific attributions to create the new attribution
   * @param fieldMap - The field map used to create the attribution fields
   * @param campaignAttributionId - The attribution field ID
   * @param routeId - The route of the attribution
   * @param attributionFields - Previous attribution fields
   */
  const createCampaignAttributionFields = async(fieldMap: any, campaignAttributionId: number, routeId: number, attributionFields: any) => {
    const campaignAttributionFields = [];

    // Create new attributions based on the field map
    const routeFields = getRfData(routeId);
    for (const routeField of routeFields) {
      for (const field of fieldMap) {
        if (routeField.fieldId === mapFieldToFieldId(field.target)) {
          if (routeField.value !== field.output) {
            campaignAttributionFields.push({ id: 'add', routeFieldId: routeField.id, campaignAttributionId, value: field.output });
          }
        }
      } 
    }
    // Loop over the old attributions to set ID
    for (const attributionField of campaignAttributionFields) {
      for (const attributionField2 of attributionFields) {
        if (attributionField.routeFieldId === attributionField2.routeFieldId) {
          attributionField.id = attributionField2.id;
        }
      }
    }
    return campaignAttributionFields;
  };

  /**
   * Create the campaign attributions
   */
  const createCampaignAttributions = () => {
    const campaignAttributions = [];
    // If you are adding in then just run the simple push
    if (id === 'add') {
      if (data.defaultRoute) campaignAttributions.push({ id: 'add', routeId: data.defaultRoute, campaignId: id, isPaid: false });
      if (data.paidRoute && paidRoute) campaignAttributions.push({ id: 'add', routeId: data.paidRoute, campaignId: id, isPaid: true });
    } else {
      // If the length is 2 then we know that there is a paid route, check for paid route deletion or change
      if (campaignAttributionData.length === 2) {
        for (const attribution of campaignAttributionData) {
          if (!attribution.isPaid)
            campaignAttributions.push({
              routeId: data.defaultRoute, 
              campaignId: parseInt(id, 10), 
              isPaid: false, 
              id: attribution.id, 
              routeChange: attribution.routeId !== data.defaultRoute });
          if (attribution.isPaid && paidRoute) {
            campaignAttributions.push({ 
              routeId: data.paidRoute, 
              campaignId: parseInt(id, 10), 
              isPaid: true, 
              id: attribution.id, 
              routeChange: attribution.routeId !== data.defaultRoute });
          } else if (attribution.isPaid && !paidRoute) {
            campaignAttributions.push({ routeId: 'delete', isPaid: true, id: attribution.id });
          }
        }
      } else {
        // There is a single default route
        campaignAttributions.push({ 
          routeId: data.defaultRoute, 
          campaignId: parseInt(id, 10), 
          id: campaignAttributionData[0].id, 
          isPaid: false, 
          routeChange: campaignAttributionData[0].routeId !== data.defaultRoute });
        if (data.paidRoute && paidRoute)
          campaignAttributions.push({ routeId: data.paidRoute, campaignId: parseInt(id, 10) , id: 'add', isPaid: true });
      }
    }
    
    return campaignAttributions;
  };

  /**
   * Validate and then query the api using the new data
   */
  const query = async() => {
    // Retrieve field map from fieldMapList component
    let fieldMapPaid = null;    
    let fieldMapDefault = null;
    if (fieldMapRefDefault.current) fieldMapDefault = fieldMapRefDefault.current.retrieveFieldMap();
    if (fieldMapRefPaid.current) fieldMapPaid = fieldMapRefPaid.current.retrieveFieldMap();
    
    const fetchedData = { 
      name: data.name, 
      description: data.description,
      verticalId: data.verticalId, 
      routes: data.routes,
      approvedData: data.approvedData,
      defaultRoute: data.defaultRoute,
      paidRoute: data.paidRoute,
      hasPaid: paidRoute,
      fieldMapDefault,
      fieldMapPaid,
    };

    // Start by validating fields
    const valid = validateData(fetchedData, setErrors);
    // Mark the fact that we've submitted the form at least once
    if (!submitted) setSubmitted(true);

    let result;
    // If the data was valid, query the api
    if (valid) {
      const campaignData = {
        name: fetchedData.name,
        description: data.description,
        verticalId: data.verticalId,
      };
      result = await queryAPI(id === 'add' ? 'POST' : 'PUT', {
        id: id === 'add' ? undefined : id,
        route: 'campaigns',
        data: campaignData,
      });

      if (result.error) {
        NotificationStore.addNotification(
          'error',
          `Something went wrong ${data.id === 'add' ? 'adding' : 'editing'} one of the the campaign data(name, vertical or description).`,
          `Error`,
        );
      } else {
        const campaignId = result.id;
        // Do something when we make sure that all the data is valid
        const campaignAttributions = createCampaignAttributions();

        for (const attribution of campaignAttributions) {
          // Check if the API call should be a post/put and add or update the route field
          // Create an attribution id value
          attribution.campaignId = campaignId;
          const attributionId = attribution.id;
          delete attribution.id;

          // Check to see if there was a route change in the attribution
          const routeChange = attribution.routeChange;
          delete attribution.routeChange;

          // Get the route name (For errors)
          const routeName = mapRouteIdToRouteName(attribution.routeId);
          // Check to see if the paid attribution was removed from the campaign
          if (attribution.routeId === 'delete' && attribution.isPaid) {

            // Get the attribution fields with that attribution ID
            const campaignAttributionFields = await queryAPI('GET', {
              route: 'campaign_attribution_fields',
              queryParams: `campaignAttributionId=${attributionId}`,
            });

            // We need to delete the attribution fields first because of a foreign constraint
            // For the attribution fields delete them
            for (const attributionField of campaignAttributionFields) {
              await queryAPI('DELETE', {
                route: 'campaign_attribution_fields',
                id: attributionField.id,
              });
            }
            // Delete the campaign attribution
            await queryAPI('DELETE', {
              route: 'campaign_attributions',
              id: attributionId,
            });
          } else {
            // If we aren't deleting the attribution we need to edit or add one
            result = await queryAPI(attributionId === 'add' ? 'POST' : 'PUT', {
              route: 'campaign_attributions',
              id: attributionId === 'add' ? undefined : attributionId,
              data: attribution,
            });
  
            if (result.error) {
              NotificationStore.addNotification(
                'error',
                `Something went wrong ${attributionId === 'add' ? 'adding' : 'editing'} ${routeName}`,
                `Error`,
              );
            } else {
              // Set the id for the campaign attribution
              const campaignAttributionId = result.id;
              // Pick the appropriate field map to add campaign attribution fields
              const fieldMap = attribution.isPaid ? fetchedData.fieldMapPaid : fetchedData.fieldMapDefault;
              result = await queryAPI('GET', {
                route: 'campaign_attribution_fields',
                queryParams: `campaignAttributionId=${campaignAttributionId}`,
              });
              if (result.error) {
                NotificationStore.addNotification(
                  'error',
                  `There was an error grabbing the one of the attributions previous attribution fields`,
                  `Error`,
                );
              } else {
                const attributionFields = result;
                // The routes changed from last time, remove the attribution fields associated with the routeId
                if (routeChange) {
                  for (const field of attributionFields) {
                    await queryAPI('DELETE', {
                      route: 'campaign_attribution_fields',
                      id: field.id,
                    });
                  }
                }
                // Create the campaign attribution fields
                const campaignAttributionFields = 
                  await createCampaignAttributionFields(fieldMap, campaignAttributionId, attribution.routeId, attributionFields);
                // Edit or add the associated campaign specific fields that are attached to the attribution
                // we are editing or adding
                for (const attributionField of campaignAttributionFields) {
                  // Create an attribution field value
                  const attributionFieldId = attributionField.id;
                  delete attributionField.id;
                  // Set the campaign attribution id for the campaign attribution
                  attributionField.campaignAttributionId = campaignAttributionId;
                  
                  // Either add in or edit the campaign attribution for each attribution
                  result = await queryAPI(attributionFieldId === 'add' ? 'POST' : 'PUT', {
                    route: 'campaign_attribution_fields',
                    id: attributionFieldId === 'add' ? undefined : attributionFieldId,
                    data: attributionField,
                  });
    
                  if (result.error) {
                    NotificationStore.addNotification(
                      'error',
                      `Something went wrong 
                      ${attributionFieldId === 'add' ? 'adding' : 'editing'} one of the campaign specific attributions.`,
                      `Error`,
                    );
                  }
                }
              }
            }
          }
        }
        
        // If there was no errors updating the campaign 
        if (result.error) {
          // If there were errors reset the field map
          setData(fetchedData);
          setResetFieldMap(true);
        }

        // If there was no errors updating the campaign 
        if (!result.error) {
          // If there were no errors, show a success message and navigate back
          NotificationStore.addNotification(
            'success',
            `${data.name} was successfully ${id === 'add' ? 'added' : 'edited.'}`,
            `Success`,
            2000,
          );
          props.navigateBack(true);
        }
      }
    }
  };

  const attributionTab = () => (
    <Fragment>
        <div className='row'>
          <div className='column'>
            <RadioList
              disabled={!admin}
              value={paidRoute.toString()}
              label={'Does this campaign have a different route for paid traffic?'}
              onChange={(event) => setPaidRoute(event.target.value === 'true')}
              options={[ { label: 'Yes', value: 'true' }, { label: 'No', value: 'false' } ]}
            />
          </div>
        </div>
        <div className='row campaignModal__extraGutterTop'>
          <div className='column'>
            <Label required={admin} text={'Default'}/>
          </div>
        </div>
        <div className='campaignModal__routeContainer'>
        <div className='row'>
          <div className='column'>
            <Select 
              disabled={!admin}
              label='Route'
              value={data.defaultRoute}
              onChange={(value) => 
                updateField('defaultRoute', value, data, setData, setErrors, submitted, setPaidFieldMapSet, setDefaultFieldMapSet)
              }
              error={errors.defaultRoute}
              options={data.routes}
            />
          </div>
        </div>
        {
          <Fragment>
            {
              (defaultFieldMapSet) ?
              <div className={`input__container ${data.defaultRoute ? '' : 'hidden'}`}>
                <Label text='Campaign Specific Fields'/>
                {
                  <div 
                    className={
                      `fieldMapModal__mappingContainer input ${errors.fieldMapDefault ? 'error' : ''} ${defaultMapEmpty ? 'hidden' : ''}`}
                  >
                    <FieldMapList
                      disabled={!admin}
                      ref={fieldMapRefDefault}
                      options={data.approvedData}
                      disableAdditions
                      useCategories={false}
                      errors={errors.fieldMapInputsDefault}
                      labels={{
                        target: 'Fields',
                        output: 'Values',
                      }}
                    />
                  </div>
                }
                {
                  defaultMapEmpty && <label>{'No fields associated with this route'}</label>
                }
                { // If an error is provided, show it
                  errors.fieldMapDefault &&
                  <label className='input__required'>{errors.fieldMapDefault}</label>
                }
              </div> : <Loading size='small'/>
            }
          </Fragment>
        }
        </div>
        {
        paidRoute &&
        <Fragment>
          <div className='row campaignModal__extraGutterTop'>
            <div className='column'>
              <Label required={admin} text={'Paid'}/>
            </div>
          </div>
          <div className='campaignModal__routeContainer'>
            <div className='row'>
              <div className='column'>
              <Select
                label='Route'
                disabled={!admin}
                value={data.paidRoute}
                onChange={(value) => 
                  updateField('paidRoute', value, data, setData, setErrors, submitted, setPaidFieldMapSet, setDefaultFieldMapSet)
                }
                error={errors.paidRoute}
                options={data.routes}
              />
              </div>  
            </div>
            {
              <Fragment>
              {
                (paidFieldMapSet) ?
                <div className={`input__container ${data.paidRoute ? '' : 'hidden'}`}>
                    <Label text='Campaign Specific Fields'/>
                    <div 
                      className={
                        `fieldMapModal__mappingContainer input ${errors.fieldMapPaid ? 'error' : ''} ${paidMapEmpty ? 'hidden' : ''}`}
                    >
                      <FieldMapList
                        ref={fieldMapRefPaid}
                        disabled={!admin}
                        options={data.approvedData}
                        useCategories={false}
                        disableAdditions
                        errors={errors.fieldMapInputsPaid}
                        labels={{
                          target: 'Fields',
                          output: 'Values',
                        }}
                      />
                    </div>
                    {
                      paidMapEmpty && <label>{'No fields associated with this route'}</label>
                    }
                    { // If an error is provided, show it
                      errors.fieldMapPaid &&
                      <label className='input__required'>{errors.fieldMapPaid}</label>
                    }
                  </div> : <Loading size='small'/>
              }
              </Fragment>
            }
        </div>
        </Fragment>
        }
        {admin &&
        <div className='row m-0'>
          <Button className='dataModal__button' onClick={query}>Save</Button>
        </div>
        }
      </Fragment>
  );

  const detailsTab = () => (
    <Fragment>
        <div className='row'>
          <div className='column'>
            <Input 
              label='Name'
              disabled={!admin}
              value={data.name}
              error={errors.name}
              autoComplete='off'
              required={admin}
              onChange={(event) => 
                updateField('name', event.target.value, data, setData, setErrors, submitted, setPaidFieldMapSet, setDefaultFieldMapSet)}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <TextArea 
              rows={4}
              disabled={!admin}
              label='Description'
              value={data.description}
              error={errors.description}
              autoComplete='off'
              required={admin}
              onChange={(event) => 
                updateField('description', event.target.value, data, setData, setErrors, 
                submitted, setPaidFieldMapSet, setDefaultFieldMapSet)}
            />
          </div>
        </div>
        <div className='row'>
          <div className='column'>
          <Select 
            required
            label='Vertical'
            disabled={!admin}
            value={data.verticalId}
            onChange={(value) => 
              updateField('verticalId', value, data, setData, setErrors, submitted, setPaidFieldMapSet, setDefaultFieldMapSet)
            }
            error={errors.verticalId}
            options={verticalOptions}
          />
          </div>  
        </div>
        
        <div className='row m-0'>
          <Button className='dataModal__button' onClick={() => setActiveTab(1)}>Next</Button>
        </div>
      </Fragment>
  );

  return (
    <DataModal
      headerText={headerText}
      loading={loading || verticalLoading}
      open={open}
      onClose={closeModal}
      className={`routes__dataModal ${props.className ? props.className : ''}`}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={[{
        title: 'Details',
        body: loading ? undefined : detailsTab(),
      },
        {
          title: 'Attribution & Routing',
          body: loading ? undefined : attributionTab(),
        } ]}
    />
  );
};

export const CampaignsModal = withRouter(CampaignsModalBase);

// HELPERS

/**
 * Function to update a property of the data
 * @param field - the field name to update
 * @param value - the value to update the field with
 * @param data - the original data object
 * @param setData - the function to update the data
 * @param submitted - whether the form has already been submitted once
 */
const updateField = (
  field: string, 
  value: any, 
  data: any, 
  setData: any, 
  setErrors: any, 
  submitted: boolean, 
  setPaidFieldMapSet: any, 
  setDefaultFieldMapSet: any,
  ) => {
  setData({ ...data, [field]: value });
  // Check to see if we are trying to update the field map for routes and set variable to re-render map
  if (field === 'paidRoute') setPaidFieldMapSet(false);
  if (field === 'defaultRoute') setDefaultFieldMapSet(false);
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
  errors.fieldMapInputsDefault = {};
  errors.fieldMapInputsPaid = {};
  // Never validate field map passively
  if (!passive) {
    errors.fieldMapDefault = '';
    errors.fieldMapPaid = '';
    // Track different error types
    const errorTypes: any = {};

    data.fieldMapDefault.forEach((map: any) => {
      // Check for empty mapping
      if (!map.output) {
        if (!errors.fieldMapInputsDefault[map.id]) errors.fieldMapInputsDefault[map.id] = {};
        errors.fieldMapInputsDefault[map.id].output = 'Value cannot be empty';
        errorTypes.emptyDefault = true;
      }
    });

    if (data.hasPaid) {
      data.fieldMapPaid.forEach((map: any) => {
        // Check for empty mapping
        if (!map.output) {
          if (!errors.fieldMapInputsPaid[map.id]) errors.fieldMapInputsPaid[map.id] = {};
          errors.fieldMapInputsPaid[map.id].output = 'Value cannot be empty';
          errorTypes.emptyPaid = true;
        }
      });
    }

    // Set error messages
    if (errorTypes.emptyDefault) {
      errors.fieldMapDefault += `${errors.fieldMapDefault ? '. ' : ''}` + 
      `Your field map should not contain any blank fields`;
    }
    if (errorTypes.emptyPaid) {
      errors.fieldMapPaid += `${errors.fieldMapPaid ? '. ' : ''}` + 
      `Your field map should not contain any blank fields`;
    }
    // Note that validation will only run 
    if (errors.fieldMapDefault) {
      errors.fieldMapDefault += `. The field map will only be re-validated when you try to save`;
    }
    if (errors.fieldMapPaid) {
      errors.fieldMapPaid += `. The field map will only be re-validated when you try to save`;
    }
    if (!errors.fieldMapDefault) {
      delete errors.fieldMapInputsDefault;
      delete errors.fieldMapDefault;
    }
    if (!errors.fieldMapPaid) {
      delete errors.fieldMapInputsPaid;
      delete errors.fieldMapPaid;
    }
  }
  // Keep old field map errors if passive
  else {
    errors.fieldMapDefault = prevErrors.fieldMapDefault;
    errors.fieldMapInputsDefault = prevErrors.fieldMapInputsDefault;
    errors.fieldMapInputsPaid = prevErrors.fieldMapInputsPaid;
    errors.fieldMapPaid = prevErrors.fieldMapPaid;
  }

  if (data.hasPaid && !data.paidRoute) errors.paidRoute = 'A paid route must be set if the campaign has a paid attribution';
  else delete errors.paidRoute;

  if (!data.defaultRoute) errors.defaultRoute = 'A default route must be set';
  else delete errors.defaultRoute;

  // Validate different fields
  if (!data.name) errors.name = 'Name cannot be blank';
  else delete errors.name;

  if (!data.description) errors.description = 'Description cannot be blank';
  else delete errors.description;

  console.log('Vertical value:', data.verticalId);

  if (data.verticalId !== 0 && !data.verticalId) errors.verticalId = 'Vertical cannot be empty';
  else delete errors.verticalId;

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
};