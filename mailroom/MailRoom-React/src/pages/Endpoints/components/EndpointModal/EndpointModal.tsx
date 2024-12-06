import React, { Fragment, useState, useEffect, useRef } from 'react';
import { DataModal, Input, Button, Select, TextArea, Toggle, Label, SimpleModal, FieldMapList } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps, Link } from 'react-router-dom';
// tslint:disable-next-line: no-submodule-imports
import { MdCallSplit } from 'react-icons/md';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
import Twig from 'twig';
import './EndpointModal.scss';

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
 * The modal for endpoint data
 */
const EndpointModalBase = (props: IProps & RouteComponentProps<any>) => {
  // Extract field params to figure out which item is being modified or created
  const id = props.match.params.id;
  options.id = id;
  
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('endpoints', JSON.parse(JSON.stringify(options)));
  // Fetch special endpoint type data
  const [typeLoading, typeData, setTypeData] = useAPI('endpoints', JSON.parse(JSON.stringify(typeOptions)));
  // Track whether we have queried the API for the type data
  const [typeRetrieved, setTypeRetrieved] = useState(false);
  // Get field map options from the DB
  const [fieldMapsLoading, fieldMapData] = useAPI('field_maps', { queryParams: 'internalEmail=false&properties[]=name&properties[]=id' });
  // Options object for field map selection
  const [fieldMapOptions, setFieldMapOptions] = useState<Array<{ label: string; value: number }>>([]);
  // We will need to know which routes are associated with an endpoint if we are not adding one
  const [routesLoading, routesData, setRoutesData] = useAPI('route_endpoint_maps', { id: 'add' });
  // Track whether we retrieved any routes
  const [routesRetrieved, setRoutesRetrieved] = useState(false);
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);
  // Track previous tab
  const [prevTab, setPrevTab] = useState(0);
  // Track original data object (if we're editing an endpoint we'll have to do some cleanup)
  const [originalData, setOriginalData] = useState<any>(undefined);
  // Track whether we have set the original data yet
  const [originalSet, setOriginalSet] = useState(false);
  // Access field map list data
  const headersRef = useRef<FieldMapList>(null);
  // Stupid state to reset header mapping if submission fails
  const [resetHeaders, setResetHeaders] = useState(false);
  // Listen for dataType changes (determines when to reinitialize headers)
  const [previousType, setPreviousType] = useState(undefined);
  // Track where cursor was for allowed fields insertion
  const [cursor, setCursor] = useState<{ position?: number, field?: string }>({});
  // Open and close field options when assisting with variables
  const [optionsOpen, setOptionsOpen] = useState(false);
  // Track when we need to update the user's cursor (injecting fields)
  const [cursorUpdateNeeded, setCursorUpdateNeeded] = useState(false);
  // Also fetch approved fields to display as options in field option helper
  const [approvedLoading, approvedData, setApprovedData] = useAPI('fields', JSON.parse(JSON.stringify(approvedOptions)));
  // Track whether we've formatted the approved data already
  const [approvedFormatted, setApprovedFormatted] = useState(false);

  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? (id === 'add' ? 'New Endpoint' : 'Edit Endpoint') : 'View Endpoint';

  /**
   * Set original data once we have retrieved the data from the endpoint
   */
  useEffect(() => {
    // Track original data retrieved from api to use for cleanup later
    if (!originalSet && !loading) {
      // If we are not adding a new endpoint, set the original data and retrieve the typeData
      if (id !== 'add') {
        setOriginalSet(true);
        setOriginalData(data);
        getTypeData(data.type, data.typeId);
        getRouteData(data.id);
      }
      // If we are adding a new endpoint, just set the type data as retrieved
      else {
        setTypeRetrieved(true);
      }
    }
  }, [loading]);

  /**
   * After type data finishes loading, initialize the header ref field map
   */
  useEffect(() => {
    // Once we have retrieved the type data, prepare to initialize headers map
    if (typeRetrieved && !submitted) {
      // Only run if type has changed OR tab has changed back
      if (previousType !== data.type || (activeTab !== prevTab && activeTab === 0)) {
        // If the type was set to http, don't update until header renders
        if (data.type === 'http') {
          // Make sure our headersRef is defined
          if (headersRef.current) {
            console.log('headersRef exists');
            const headerArr: any[] = [];
    
            for (const key in typeData.headers) {
              if (typeData.headers.hasOwnProperty(key)) {
                headerArr.push({
                  target: key,
                  output: typeData.headers[key],
                });
              }
            }

            headersRef.current.initFieldMap(headerArr);

            // Update previous type
            setPreviousType(data.type);
          }
        }
        // If the type was set to email, update the previous type immediately
        else {
          // Update previous type
          setPreviousType(data.type);
        }
      }
    }
  }, [typeRetrieved, submitted, headersRef.current, data.type, activeTab]);

  /**
   * Format field map options
   */
  useEffect(() => {
    // Generate field map options for HTTP field map selection
    if (!fieldMapsLoading) {
      const fieldOptions: Array<{ label: string; value: number }> = [];

      // Loop through field maps and format our options array
      fieldMapData.forEach((fieldMap: any) => {
        fieldOptions.push({
          label: fieldMap.name,
          value: fieldMap.id,
        });
      });

      setFieldMapOptions(fieldOptions);
    }
  }, [fieldMapsLoading]);

  /**
   * Initialize the field map data when we finish loading the first time
   */
  useEffect(() => {
    if (!loading && !approvedLoading && !approvedFormatted) {
      // Format approved fields data
      const approvedFields: any[] = [];
      approvedData.forEach((field: any) => {
        approvedFields.push({
          label: field.name,
          value: field.name,
        });
      });

      // Make note that we've formatted the data
      setApprovedFormatted(true);
      // Initialize the field map
      setApprovedData(approvedFields);
    }
  }, [loading, approvedLoading]);

  /**
   * Revalidates after submission
   */
  useEffect(() => {
    // Revalidate data after change if we previously had an error
    if (submitted) {
      const allData = { ...data, ...typeData };
      validateData(allData, setErrors, approvedData, true);
    }
  }, [data, typeData]);

  /**
   * Reset headers if submission fails
   */
  useEffect(() => {
    if (!loading && resetHeaders) {
      if (headersRef.current) headersRef.current.initFieldMap(typeData.headers);
      setResetHeaders(false);
    }
  }, [resetHeaders, loading]);

  /**
   * Focus on field options when it appears
   */
  useEffect(() => {
    if (optionsOpen) {
      // Wait a second for the modal to open
      setTimeout(() => {
        // Get options select
        const options = document.getElementById('fieldOptions');
        console.log(options);

        // Focus it if we find it
        if (options) options.focus();
      }, 50);
    }
  }, [optionsOpen]);

  /**
   * Update where the cursor is after field options close
   */
  useEffect(() => {
    if (cursorUpdateNeeded && cursor.field) {
      // Get input that needs cursor update
      const input: any = document.getElementById(cursor.field);

      // If we find it, focus on it and update cursor position
      if (input) {
        input.focus();
        input.setSelectionRange(cursor.position, cursor.position);
      }

      // Reset cursor
      setCursor({});
      setCursorUpdateNeeded(false);
    }
  }, [cursorUpdateNeeded, typeData]);

  /**
   * Retrieve the type data once we have the original endpoint
   * @param type - which type we need to query
   * @param typeId - the id of the endpoint type we need to query
   */
  const getTypeData = async(type: string, typeId: number) => {
    // Query the correct endpoints route with the correct id
    const result = await queryAPI('GET', { route: `${type}_endpoints`, id: typeId });
    
    // Update the type data, but keep empty fields in case type is changed
    setTypeData({ ...typeData, ...result });
    
    // Make note that we have finally set the type data
    setTypeRetrieved(true);
  };

  /**
   * Retrieve the routes paired with the endpoint
   * @param id - id of the route to retrieve the data of
   */
  const getRouteData = async(id: number) => {
    const promises = [];
    // Query the route endpoint map
    promises.push(queryAPI('GET', { route: `route_endpoint_maps`, queryParams: `endpointId=${id}` }));
    // Query the routes to get names
    promises.push(queryAPI('GET', { apiName: 'homebase', route: `routes` }));
    
    // Wait for both queries
    const result = await Promise.all(promises);

    // Extract data
    const routeMaps = result[0];
    const routes = result[1];

    const formattedRoutes: any[] = [];

    // Map the routeMap ids and route name to each object
    routeMaps.forEach((routeMap: any) => {
      formattedRoutes.push({
        id: routeMap.id,
        routeId: routeMap.routeId,
        name: routes.find((route: any) => route.id === routeMap.routeId).name,
      });
    });

    // Loop through routeMaps and get name
    // Update the type data, but keep empty fields in case type is changed
    setRoutesData(formattedRoutes);

    // Make note that we have finally set the type data
    setRoutesRetrieved(true);
  };

  /**
   * Validate and then query the api using the new data
   */
  const query = async() => {
    console.log('Querying api');
    // Track the previous header array state in case an API errors
    let previousHeaders: any = [];

    // Retrieve header from fieldMapList component
    const formattedTypeData = { ...typeData };
    if (headersRef.current) {
      previousHeaders = headersRef.current.retrieveFieldMap();
      formattedTypeData.headers = previousHeaders;
    }

    // Start by validating fields
    const valid = validateData({ ...data, ...formattedTypeData }, setErrors, approvedData);
    // Mark the fact that we've submitted the form at least once
    if (!submitted) setSubmitted(true);

    // If the data was valid, query the api
    if (valid) {
      console.log('valid');

      // Format header properly for DB
      const formattedHeader: any = {};
      
      // If the endpoint is of HTTP type, format the headers properly
      if (data.type === 'http') {
        formattedTypeData.headers.forEach((map: any) => {
          formattedHeader[map.target] = map.output;
        });

        // Update type data before save
        formattedTypeData.headers = formattedHeader;
      }

      // Handle any back-end changes to the endpoint type (and determine new typeId)
      const typeId = await handleEndpointType(formattedTypeData);

      // If the type operation succeeded, update endpoint
      if (typeId) {
        const result = await queryAPI(id === 'add' ? 'POST' : 'PUT', {
          id: id === 'add' ? undefined : id,
          data: {
            ...data,
            typeId,
          },
        });

        // If there were no errors, show a success message and navigate back
        if (!result.error) {
          NotificationStore.addNotification(
            'success',
            `${data.name} was successfully ${id === 'add' ? 'added' : 'edited.'}`,
            `Success`,
            2000,
          );
          props.navigateBack(true);
        }
      }
      // If there was an error, we need to reset the type state to use the state from the field map
      else {
        // Reset header to array
        formattedTypeData.headers = previousHeaders;
        setTypeData(formattedTypeData);
        setResetHeaders(true);
      }

    }
  };

  /**
   * Handles any changes that need to be made based on the original object's type and new data.
   * Will sometimes delete old endpoint type entries, edit old entries, or create new entries 
   */
  const handleEndpointType = async(finalTypeData: any) => {
    // Initialize a typeId to return
    let typeId = 0;
    // Determine which type we are using and what data we need
    const formattedTypeData = data.type === 'email' ?
    // Email fields
    {
      recipient: finalTypeData.recipient,
      cc: finalTypeData.cc,
      bcc: finalTypeData.bcc,
      subject: finalTypeData.subject,
      body: finalTypeData.body,
      replyTo: finalTypeData.replyTo,
    } :
    // HTTP fields
    {
      url: finalTypeData.url,
      method: finalTypeData.method,
      stripBlanks: finalTypeData.stripBlanks,
      fieldMapId: finalTypeData.fieldMapId,
      headers: finalTypeData.headers,
    };
    console.log(formattedTypeData);

    // If we are adding a new entry or the type has changed, we need to create a new type entry
    if (!originalData || originalData.type !== data.type) {
      const result = await queryAPI('POST', {
        route: `${data.type}_endpoints`,
        data: formattedTypeData,
      });

      // If we have an error, return prematurely
      if (result.error) return false;

      // Assign typeId to the id of the new item created
      typeId = result.id;

      // If the selected type has changed, we also need to delete the old type
      if (originalData && originalData.type !== data.type) {
        await queryAPI('DELETE', {
          route: `${originalData.type}_endpoints`,
          id: originalData.typeId,
        });
      }
    }
    // If the type is still the same, we need to edit the original type entry
    else {
      const result = await queryAPI('PUT', {
        route: `${originalData.type}_endpoints`,
        id: originalData.typeId,
        data: formattedTypeData,
      });

      // If we have an error, return prematurely
      if (result.error) return false;

      // Assign typeId to the id of the item edited
      typeId = result.id;
    }

    return typeId;
  };

  /**
   * Function to insert selected field where user's cursor was when options menu value changes
   * @param fieldName - the name of the field to be injected
   */
  const insertField = (
    fieldName: string, 
  ) => {
    // If a field was selected, inject it
    if (fieldName) {
      // Get previous value in input
      const prevValue = typeData[cursor.field as string];

      // Use previous value and field name to inject
      const newValue = [prevValue.slice(0, cursor.position), fieldName, '}}', prevValue.slice(cursor.position)].join('');
      // Update value
      setTypeData({ ...typeData, [cursor.field as string]: newValue });
      
      // Close options
      setOptionsOpen(false);

      // Calculate new position of cursor
      const newCursorPos = cursor.position as number + fieldName.length + 2;
      // Update cursor position in state
      setCursor({
        field: cursor.field,
        position: newCursorPos,
      });
      // Trigger cursor position update using effect
      setCursorUpdateNeeded(true);
    }
  };

  /**
   * Detail tab for modal
   */
  const detailsTab = () => {
    return (
      <Fragment>

        <Input 
          label='Name'
          value={data.name}
          error={errors.name}
          autoComplete='off'
          required={UserStore.user && UserStore.user.isAdmin}
          disabled={UserStore.user && !UserStore.user.isAdmin}
          onChange={(event) => 
            updateField(
              'name', 
              event.target.value, 
              data, 
              setData, 
              setCursor,
              setOptionsOpen,
            )
          }
        />

        <div className='row'>
          <div className='column endpointModal__flex2'>
            <Select 
              label='Endpoint Type'
              value={data.type}
              onChange={(value) => 
                updateField(
                  'type', 
                  value, 
                  data, 
                  setData, 
                  setCursor,
                  setOptionsOpen,
                )
              }
              error={errors.type}
              options={[
                {
                  label: 'Email',
                  value: 'email',
                },
                {
                  label: 'HTTP',
                  value: 'http',
                },
              ]}
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
            />
          </div>
          <div className='column'>
            <Toggle
              label='Active'
              value={data.active}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onClick={() => 
                updateField(
                  'active', 
                  !data.active, 
                  data, 
                  setData, 
                  setCursor,
                  setOptionsOpen,
                )
              }
            />
          </div>
        </div>

        {generateEndpointTypeInputs()}

        {/* Open options menu when user types {{ */}
        <SimpleModal
          open={optionsOpen}
          onClose={() => setOptionsOpen(false)}
        >
          <Select 
            id='fieldOptions'
            placeholder='Select an approved field...'
            className={{ container: 'endpointsModal__fieldOptions' }}
            value={null}
            onChange={(value) => insertField(value)}
            error={errors.type}
            options={approvedData}
          />
        </SimpleModal>

        { // Remove button if user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <div className='row m-0'>
            <Button className='dataModal__button' onClick={() => query()}>Save</Button>
          </div>
        }

      </Fragment>
    );
  };
  
  /**
   * Generates additional fields based on the selected endpoint type
   */
  const generateEndpointTypeInputs = () => {
    // Return email fields
    if (data.type === 'email') {
      return (
        <Fragment>

          <div className='row'>
            <div className='column'>
              <Input
                label='Recipient'
                value={typeData.recipient}
                error={errors.recipient}
                autoComplete='off'
                required={UserStore.user && UserStore.user.isAdmin}
                disabled={UserStore.user && !UserStore.user.isAdmin}  
                onChange={(event) => 
                  updateField(
                    'recipient', 
                    event.target.value, 
                    typeData, 
                    setTypeData, 
                    setCursor,
                    setOptionsOpen,
                  )
                }
              />
            </div>
            <div className='column'>
              <Input
                label='Reply To'
                value={typeData.replyTo}
                error={errors.replyTo}
                placeholder='no-reply@launchthat.com'
                autoComplete='off'
                disabled={UserStore.user && !UserStore.user.isAdmin}  
                onChange={(event) => 
                  updateField(
                    'replyTo', 
                    event.target.value, 
                    typeData, 
                    setTypeData, 
                    setCursor,
                    setOptionsOpen,
                  )
                }
              />
            </div>
          </div>

          <div className='row'>
            <div className='column'>
              <Input
                label='CC'
                value={typeData.cc}
                error={errors.cc}
                autoComplete='off'
                disabled={UserStore.user && !UserStore.user.isAdmin}
                onChange={(event) => 
                  updateField(
                    'cc', 
                    event.target.value, 
                    typeData, 
                    setTypeData, 
                    setCursor,
                    setOptionsOpen,
                  )
                }
              />
            </div>
            <div className='column'>
              <Input
                label='BCC'
                value={typeData.bcc}
                error={errors.bcc}
                autoComplete='off'
                disabled={UserStore.user && !UserStore.user.isAdmin}
                onChange={(event) => 
                  updateField(
                    'bcc', 
                    event.target.value, 
                    typeData, 
                    setTypeData, 
                    setCursor,
                    setOptionsOpen,
                  )
                }
              />
            </div>
          </div>

          <div className='row'>
            <div className='column'>
              <Input
                id='subject'
                label='Subject'
                value={typeData.subject}
                error={errors.subject}
                autoComplete='off'
                required={UserStore.user && UserStore.user.isAdmin}
                disabled={UserStore.user && !UserStore.user.isAdmin}
                onChange={(event) =>
                  updateField(
                    'subject', 
                    event.target.value, 
                    typeData, 
                    setTypeData, 
                    setCursor,
                    setOptionsOpen,
                  )
                }
                info={'This field allows for the use of twig logic. ' + 
                  'You can insert variables by surrounding them with double curly brackets, like {{first_name}}.'}
              />
            </div>
          </div>

          <div className='row'>
            <div className='column'>
              <TextArea
                id='body'
                rows={10}
                label='Body'
                value={typeData.body}
                error={errors.body}
                autoComplete='off'
                required={UserStore.user && UserStore.user.isAdmin}
                disabled={UserStore.user && !UserStore.user.isAdmin}
                onChange={(event) => 
                  updateField(
                    'body', 
                    event.target.value, 
                    typeData, 
                    setTypeData, 
                    setCursor,
                    setOptionsOpen,
                  )
                }
                info={'This field allows for the use of twig logic. ' + 
                  'You can insert variables by surrounding them with double curly brackets, like {{first_name}}.'}
              />
            </div>
          </div>

        </Fragment>
      );
    }
    // Return http fields
    else if (data.type === 'http') {
      return (
        <Fragment>

        <div className='row'>
          <div className='column'>
            <Input
              id='url'
              label='URL'
              value={typeData.url}
              error={errors.url}
              autoComplete='off'
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => 
                updateField(
                  'url', 
                  event.target.value, 
                  typeData, 
                  setTypeData, 
                  setCursor,
                  setOptionsOpen,
                )
              }
              info={'This field allows for the use of twig logic. ' + 
                'You can insert variables by surrounding them with double curly brackets, like {{first_name}}.'}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column endpointModal__flex2'>
            <Select 
              label='Method'
              value={typeData.method}
              onChange={(value) => 
                updateField(
                  'method', 
                  value, 
                  typeData, 
                  setTypeData, 
                  setCursor, 
                  setOptionsOpen,
                )
              }
              error={errors.method}
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              options={[
                {
                  label: 'GET',
                  value: 'GET',
                },
                {
                  label: 'POST',
                  value: 'POST',
                },
                {
                  label: 'PUT',
                  value: 'PUT',
                },
                {
                  label: 'DELETE',
                  value: 'DELETE',
                },
              ]}
            />
          </div>
          <div className='column'>
            <Toggle
              label='Remove Empty Fields?'
              value={typeData.stripBlanks}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onClick={() => 
                  updateField(
                  'stripBlanks', 
                  !typeData.stripBlanks, 
                  typeData, 
                  setTypeData, 
                  setCursor, 
                  setOptionsOpen,
                )
              }
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <div className='input__container'>
              <Label text='Headers'/>
              <div className={`endpointModal__headersContainer input ${errors.headers ? 'error' : ''}`}>
                <FieldMapList
                  ref={headersRef}
                  errors={errors.headerInputs}
                  disabled={UserStore.user && !UserStore.user.isAdmin}
                  labels={{ target: 'Key', output: 'Value' }}
                />
              </div>
              { // If an error is provided, show it
                errors.headers &&
                <label className='input__required'>{errors.headers}</label>
              }
            </div>
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <Select 
              label='Field Map'
              value={typeData.fieldMapId}
              onChange={(value) =>
                updateField(
                  'fieldMapId', 
                  value, 
                  typeData, 
                  setTypeData, 
                  setCursor, 
                  setOptionsOpen,
                )
              }
              error={errors.fieldMapId}
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              options={fieldMapOptions}
            />
          </div>
        </div>

        </Fragment>
      );
    }
    // Return nothing
    else return;
  };

  /**
   * Routes tab for modal
   */
  const routesTab = () => {
    return (
      <Fragment>
        <div className='row'>
          <div className='column'>
            <div className='endpointModal__overallRouteContainer'>
              {generateRoutesList()}
            </div>
          </div>
        </div>
      </Fragment>
    );
  };

  /**
   * Function to handle tab change (update active and prev)
   */
  const changeTab = (tab: number) => {
    setPrevTab(activeTab);
    setActiveTab(tab);
  };

  /**
   * Generate a list of links to associated routes
   */
  const generateRoutesList = () => {
    if (routesData.length) {
      return routesData.map((route: any) => {
        return (
          <div className='endpointModal__routeContainer' key={route.id}>
            <Link className='endpointModal__routeLink' to={`/routes/${route.routeId}`}>
              <div className='endpointModal__routeRow'><MdCallSplit className='endpointModal__routeIcon'/> {route.name}</div>
            </Link>
          </div>
        );
      });
    }
    else {
      return <h4>No Routes Yet</h4>;
    }
  };

  return (
    <DataModal
      headerText={headerText}
      loading={loading || !typeRetrieved || typeLoading || fieldMapsLoading || approvedLoading}
      open={open}
      onClose={closeModal}
      className={`endpoints__dataModal ${props.className ? props.className : ''}`}
      activeTab={activeTab}
      setActiveTab={changeTab}
      tabs={routesRetrieved ?
      // If we are editing an existing endpoint, show the routes tab
      [
        {
          title: 'Details',
          body: loading || !typeRetrieved || typeLoading || fieldMapsLoading ? undefined : detailsTab(),
        },
        {
          title: 'Routes',
          body: loading || !typeRetrieved || typeLoading || fieldMapsLoading ? undefined : routesTab(),
        },
      ] : 
      // If we are adding a new endpoint, don't show the routes tab
      [
        {
          title: 'Details',
          body: loading || !typeRetrieved || typeLoading || fieldMapsLoading ? undefined : detailsTab(),
        },
      ]
      }
    />
  );
};

/**
 * The modal for endpoint data
 */
export const EndpointModal = withRouter(EndpointModalBase);

// HELPERS

/**
 * Function to update a property of the data (and potentially trigger field options helper)
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
  setCursor: any, 
  setOptionsOpen: any,
) => {
  // Check for twig variable input on applicable fields
  if (field === 'url' || field === 'subject' || field === 'body') {
    // Only run the function if we've added a character (not deleted one)
    if (value.length >= data[field].length) checkTwigInput(field, setCursor, setOptionsOpen);
  }

  // Update data
  setData({ ...data, [field]: value });
};

/**
 * Function that triggers popup select with available fields when user types {{
 * @param field - the name of the field to be checked
 * @param setCursor - function used to track cursor in component state
 */
const checkTwigInput = (field: string, setCursor: any, setOptionsOpen: any) => {
  // Grab input
  const input: any = document.getElementById(field);

  // See if the user has just typed {{ , which signals variable
  if (input.selectionStart >= 2 && input.value[input.selectionStart - 1] === '{' && input.value[input.selectionStart - 2] === '{') {
    // Track users cursor position so variable can be injected here
    setCursor({
      position: input.selectionStart,
      field,
    });

    // Open options menu
    setOptionsOpen(true);
  }
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
const validateData = (data: any, setErrors: any, approvedFields: any, passive?: boolean) => {
  console.log(data);
  
  const errors: any = {};

  // Validate different fields
  if (!data.name) errors.name = 'Name cannot be blank';

  if (!data.type) errors.type = 'You must select a type';

  // Validate differently based on which type is selected
  // Validate email type
  if (data.type === 'email') {
    if (!data.recipient) errors.recipient = 'Recipient cannot be blank';
    else if (!Validate.email(data.recipient, true)) errors.recipient = 'Recipient is formatted incorrectly';

    if (data.replyTo && !Validate.email(data.replyTo)) errors.replyTo = 'Reply To is formatted incorrectly';
    
    if (data.cc && !Validate.email(data.cc, true)) errors.cc = 'CC is formatted incorrectly';

    if (data.bcc && !Validate.email(data.bcc, true)) errors.bcc = 'BCC is formatted incorrectly';
  
    if (!data.subject) errors.subject = 'Subject cannot be blank';
    else {
      // Try to generate a twig template using the input (test whether it's valid)
      try {
        Twig.twig({
          data: data.subject,
        });

        // Verify no unapproved fields are used
        if (!verifyApprovedFields(data.subject, approvedFields)) errors.subject = 'You are using at least one non-standard field.';
      }
      catch (err) {
        console.log(err);
        errors.subject = 'Your twig is invalid';
      }
    }

    if (!data.body) errors.body = 'Body cannot be blank';
    else {
      // Try to generate a twig template using the input (test whether it's valid)
      try {
        Twig.twig({
          data: data.body,
        });

        // Verify no unapproved fields are used
        if (!verifyApprovedFields(data.body, approvedFields)) errors.body = 'You are using at least one non-standard field.';
      }
      catch (err) {
        console.log(err);
        errors.body = 'Your twig is invalid';
      }
    }
  }
  // Validate http type
  else if (data.type === 'http') {
    errors.headerInputs = {};

    if (!data.url) errors.url = 'URL cannot be blank';
    else {
      // Try to generate a twig template using the input (test whether it's valid)
      try {
        Twig.twig({
          data: data.url,
        });

        // Verify no unapproved fields are used
        if (!verifyApprovedFields(data.url, approvedFields)) errors.url = 'You are using at least one non-standard field.';
      }
      catch (err) {
        console.log(err);
        errors.url = 'Your twig is invalid';
      }
    }

    if (!data.method) errors.method = 'You must select a method';

    if (!data.fieldMapId) errors.fieldMapId = 'Field Map is required';

    // Headers validation below (more complex)
    errors.headers = '';
    
    if (!passive && data.headers) {
      // Track different error types
      const errorTypes: any = {};
      // We need to check each map (none should be mapped twice or be blank)
      const alreadyMapped: any = {};
      data.headers.forEach((map: any) => {
        console.log(map);
        // Check for empty mapping
        if (!map.target || !map.output) {
          console.log('Found empty');
          if (!map.target) {
            if (!errors.headerInputs[map.id]) errors.headerInputs[map.id] = {};
            errors.headerInputs[map.id].target = 'Field cannot be empty';
            errorTypes.empty = true;
          }
          if (!map.output) {
            if (!errors.headerInputs[map.id]) errors.headerInputs[map.id] = {};
            errors.headerInputs[map.id].output = 'Field cannot be empty';
            errorTypes.empty = true;
          }
        }
        if (map.target) {
          // Check for duplicate mapping
          if (alreadyMapped[map.target]) {
            console.log('Found duplicate');
            if (!errors.headerInputs[map.id]) errors.headerInputs[map.id] = {};
            errors.headerInputs[map.id].target = 'This input already exists.';
            errorTypes.duplicate = true;
          }
          else alreadyMapped[map.target] = true;
        }
      });

      // Set error messages
      if (errorTypes.duplicate) {
        errors.headers += `Your headers list has at least one input that appears twice (should only appear once)`;
      }
      if (errorTypes.empty) {
        errors.headers += `${errors.headers ? '. ' : ''}` + 
        `Your headers list should not contain any blank inputs or outputs`;
      }
      // Note that validation will only run once resubmitted
      if (errors.headers) {
        errors.headers += `. The headers list will only be re-validated when you try to save`;
      }
    }
    if (!errors.headers) {
      delete errors.headerInputs;
      delete errors.headers;
    }

  }
  console.log(errors);
  setErrors(errors);

  // Set any errors that occurred (if we are submitting the form)
  if (!passive && !Validate.empty(errors)) {
    NotificationStore.addNotification('error', 'Please fix any fields with errors and try again.', 'Field Errors', 2000);
    return false;
  }

  return true;
};

/**
 * Checks whether the provided text contains only approved fields
 * @param text - text to validate
 * @param approvedFields - list of approved fields
 * 
 * @returns
 * @param {boolean} valid - whether the provided text includes only approved fields 
 */
const verifyApprovedFields = (text: string, approvedFields: any) => {
  // Convert approved fields to map for easier use
  const map: any = {};
  for (const field of approvedFields) {
    map[field.value] = true;
  }

  // Split the text to make it easier to use
  const result = text.split('{{');

  // Generate an array to store our variable names
  const fields: string[] = [];

  // Populate list of variables to check
  let currentVar = '';
  // Loop through our array of results (ignore first)
  for (let i = 1; i < result.length; i++) {
    // Loop through characters of each entry to find where variable ends
    for (const char of result[i]) {
      // We have found the end of the variable name
      if (char === '}') {
        fields.push(currentVar);
        currentVar = '';
        break;
      }
      // We are creating our variable from each character
      else {
        currentVar += char;
      }
    }
  }

  // If we found some variables, verify they are in the approved fields list
  if (result.length) {
    // Loop through the variables in the text
    for (const field of fields) {
      // If the field isn't in our map, it's not an approved field
      if (!map[field]) {
        console.log(`Non standard field found - ${field}`);
        return false;
      }
    }
  }

  // If the result is empty, no variables are used and it's valid
  return true;
};

/**
 * Options used in API hook (defines id of item to fetch and an empty representation of the object in case we're adding it)
 */
const options = {
  id: '',
  emptyObj: {
    name: '',
    type: '',
    typeId: '',
    active: false,
  },
};

/**
 * Options used in type API hook (defines id of item to fetch and an empty representation of the object in case we're adding it)
 * We set the id to 'add' so that the type is not queried on load (need to wait until we know the type id of the endpoint)
 */
const typeOptions = {
  id: 'add',
  emptyObj: {
    // Email fields
    recipient: '',
    cc: '',
    bcc: '',
    subject: '',
    body: '',
    replyTo: '',
    // HTTP fields
    url: '',
    method: '',
    headers: {},
    stripBlanks: true,
    fieldMapId: '',
  },
};

/**
 * Options used to retrieve approved fields from API hook
 */
const approvedOptions = {
  apiName: 'homebase',
  queryParams: 'order[name]=asc',
};