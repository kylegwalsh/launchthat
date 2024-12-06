import React, { Fragment, useState, useEffect, useContext } from 'react';
import { DataModal, Input, Button, TextArea, Label } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
import './FieldModal.scss';

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
 * The modal for fields data
 */
const FieldModalBase = (props: IProps & RouteComponentProps<any>) => {
  // Extract field params to figure out which item is being modified or created
  const id = props.match.params.id;
  options.id = id;
  
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI] = useAPI('fields', JSON.parse(JSON.stringify(options)));
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);

  // Used to grab field maps for reference to deletion
  const [FMLoading, FMData] = useAPI('field_maps', { apiName: 'mailroom' });
  // Get the data for the email endpoints
  const [emailEndpointLoading, emailEndpointData] = useAPI('email_endpoints', { apiName: 'mailroom' });
  // Get the data for the endpoints
  const [endpointsLoading, endpointsData] = useAPI('endpoints', { apiName: 'mailroom' });
  // Loading while trying to find the pending deletes before the field can be updated
  const [deletesLoading, setDeletesLoading] = useState(false);
  // Items that need to be removed from referencing the field before the field can be edited
  const [pendingDeletes, setPendingDeletes] = useState<any>(undefined); 

  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? (id === 'add' ? 'New Field' : 'Edit Field') : 'View Field';
  
  const [ validating, setValidating ] = useState(false);

  // A function that takes the id of the email endpoint and finds the associated endpoint
  const getEndpointFromEmailEndpoint = (id: number) => {
    // Loop through and find the required matches that could conflict a delete
    for (const endpoint of endpointsData) {
      if (id === endpoint.typeId && endpoint.type === 'email') return endpoint;
    }
    return null;
  };

  // A function to handle the creation of the pending deletes object
  const createPendingDeletes = () => {
    setDeletesLoading(true);
    // URLS for mailroom
    const fieldMapsURL = `https://mailroom.launchthat.com/fieldMaps`;
    const emailEndpointsURL = 'https://mailroom.launchthat.com/endpoints';

    // Pending deletes object for fields
    const pendingDeletes = {
      'Email Endpoints': [] as any[], 
      'Internal Field Map': [] as any[],
      'External Field Maps': [] as any[],
    };
      // Loop through external and internal field map
    for (const map of FMData) {
      // Check to see if it is the internal field map
      if (map.internalEmail) {
          // Loop through the field map types inside of the fieldMap array
        for (const mapType of map.fieldMap) {
            // Find the values of the first object in the mapType array and loop through the fields in it
          for (const field of mapType[Object.keys(mapType)[0]]) {
            if (field.target === data.name) {
              console.log('We found it in the internal!!!');
              pendingDeletes['Internal Field Map'].push(
                  { name: `${Object.keys(mapType)[0]} - ${field.target}`, link: `${fieldMapsURL}/internal` });
              console.log('Please remove it before we can delete');
              break;
            } 
          }
        }
      } else {
          // Loop through the fields inside of the fieldMap array for external field maps
        for (const field of map.fieldMap) {
          if (field.target === data.name) {
            pendingDeletes['External Field Maps'].push({ name: `${map.name} - ${field.target}`, link: `${fieldMapsURL}/external` });
            console.log('We found it the external map');
            console.log('Please remove it before we can delete');
            break;
          }
        }
      }
    }
    for (const emailEndpoint of emailEndpointData) {
      if (emailEndpoint.body.includes(`{{${data.name}}}`) || emailEndpoint.subject.includes(`{{${data.name}}}`)) {
        const endpoint = getEndpointFromEmailEndpoint(emailEndpoint.id);
        pendingDeletes['Email Endpoints'].push({ name: endpoint.name, link: `${emailEndpointsURL}/${endpoint.id}` });
      }
    }

    // Set the loading to false and set the pending deletes to the pending deletes
    // found inside of the field maps
    if (pendingDeletes['External Field Maps'].length !== 0 || 
      pendingDeletes['Internal Field Map'].length !== 0 || 
      pendingDeletes['Email Endpoints'].length !== 0) 
      setPendingDeletes(pendingDeletes);
    else setPendingDeletes(undefined);

    setDeletesLoading(false);
  };

  /**
   * Revalidates after submission
   */
  useEffect(() => {
    // Check to see if all the APIs are finished loading and start checking for any references to the field
    if (!FMLoading && !endpointsLoading && !emailEndpointLoading) createPendingDeletes();
    // Revalidate data after change if we previously had an error
    if (submitted) validateData(data, setErrors, true);
  }, [data, FMLoading, endpointsLoading, emailEndpointLoading]);

  /**
   * Validate and then query the api using the new data
   */
  const query = async() => {
    console.log('Querying api');
    // Start by validating fields

    if (data.shortName === '') setData({ ...data, shortName: null });

    setValidating(true);
    const valid = await validateData(data, setErrors, false, queryAPI);
    // Mark the fact that we've submitted the form at least once
    if (!submitted) setSubmitted(true);

    // If the data was valid, query the api
    if (valid) {
      console.log('valid');
      // We are either creating a new object or updating one

      const result = await queryAPI(id === 'add' ? 'POST' : 'PUT', {
        id: id === 'add' ? undefined : id,
        data,
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
    setValidating(false);
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
          <div className='column'>
            <Input 
              label='Short Name'
              value={data.shortName || ''}
              error={errors.shortName}
              autoComplete='off'
              info={'The short name is used by invoca to specify a field using fewer characters.\
              It should be no more than 6 characters long.'}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('shortName', event.target.value, data, setData)}
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

        { // Remove button and warning if the user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <Fragment>
            <div className='row m-0'>
              <Button className='dataModal__button' onClick={() => query()}>Save</Button>
            </div>
            { // Show warning if there are data objects that could be affected
              pendingDeletes && 
              <div className='pendingDeletes__fieldModal'>
                <div className='row m-0'>
                  <p>Keep in mind that this field is used on the following items in Mailroom and must be edited there as well.</p>
                </div>
                <div className='row'>
                  <div className='column'>
                    {
                      Object.keys(pendingDeletes).map((key, index) => {
                        return (
                          <div key={index}>
                            {(pendingDeletes && pendingDeletes[key].length !== 0) && <Label text={key}/>}
                            <ul>
                            {
                              pendingDeletes && pendingDeletes[key].map((item: any, index: number) => {
                                return (
                                  <li key={index}>
                                    <a target='_blank' href={item.link}>
                                      <p>{item.name}</p>
                                    </a>
                                  </li>);
                              })
                            }
                            </ul>
                          </div>
                        );
                      })
                    }
                  </div>
                </div>
              </div>
            }
          </Fragment>
        }
      </Fragment>
    );
  };

  return (
    <DataModal
      headerText={headerText}
      loading={validating || loading || deletesLoading || FMLoading || endpointsLoading || emailEndpointLoading}
      open={open}
      onClose={closeModal}
      className={`fields__dataModal ${props.className ? props.className : ''}`}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={[{
        title: 'Details',
        body: loading ? undefined : detailsTab(),
      }]}
    />
  );
};

/**
 * The modal for field data
 */
export const FieldModal = withRouter(FieldModalBase);

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
const validateData = async(data: any, setErrors: any, passive?: boolean, queryAPI?: any) => {
  const errors: any = {};
  const tests = [];
  // C
  if (!passive) {
    const testShortName = queryAPI('GET', {
      queryParams: `shortName=${data.shortName}`,
    });
  
    const testName = queryAPI('GET', {
      queryParams: `name=${data.name}`,
    });
  
    tests.push(testShortName);
    tests.push(testName);
  
    const result = await Promise.all(tests);
    console.log(result);
  
    if (result[0].length !== 0 && result[0][0].id !== data.id) {
      errors.shortName = 'This short name already exists on another field.';
    }
  
    if (result[1].length !== 0 && result[1][0].id !== data.id) {
      errors.name = 'This name already exists on another field.';
    }
  }

  // Validate different fields
  if (!data.name) errors.name = 'Name cannot be blank';

  if (!data.description) errors.description = 'Description cannot be blank';

  if (data.shortName && data.shortName.length > 6) errors.shortName = 'Short name can be at most 6 characters'; 

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