import React, { Fragment, useState, useEffect } from 'react';
import { DataModal, Input, TextArea, Button } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
import './VerticalModal.scss';

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
 * The modal for vertical data
 */
const VerticalModalBase = (props: IProps & RouteComponentProps<any>) => {
  // Extract route params to figure out which item is being modified or created
  const id = props.match.params.id;
  options.id = id;
  
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('verticals', JSON.parse(JSON.stringify(options)));
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);

  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? (id === 'add' ? 'New Vertical' : 'Edit Vertical') : 'View Vertical';

  /**
   * Revalidates after submission
   */
  useEffect(() => {
    // Revalidate data after change if we previously had an error
    if (submitted) validateData(data, setErrors, true);
  }, [data]);

  /**
   * Validate and then query the api using the new data
   */
  const query = async() => {
    console.log('Querying api');
    // Start by validating fields
    const valid = validateData(data, setErrors);
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
            <Input
              label='Lead Email Distro'
              type='email'
              autoComplete='off'
              value={data.leadEmail}
              error={errors.leadEmail}
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('leadEmail', event.target.value, data, setData)}
              info={'You can separate emails with commas (example@launchthat.com, example2@launchthat.com)'}
            />
          </div>
          <div className='column'>
            <Input
              label='Lead Test Email Distro'
              type='email'
              autoComplete='off'
              value={data.leadEmailTest}
              error={errors.leadEmailTest}
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('leadEmailTest', event.target.value, data, setData)}
              info={'You can separate emails with commas (example@launchthat.com, example2@launchthat.com)'}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <Input
              label='Lead Slack Channel'
              value={data.leadSlack}
              error={errors.leadSlack}
              autoComplete='off'
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('leadSlack', event.target.value, data, setData)}
            />
          </div>
          <div className='column'>
            <Input
              label='Lead Test Slack Channel'
              value={data.leadSlackTest}
              error={errors.leadSlackTest}
              autoComplete='off'
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('leadSlackTest', event.target.value, data, setData)}
            />
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
      loading={loading}
      open={open}
      onClose={closeModal}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      className={`${props.className ? props.className : ''}`}
      tabs={[{
        title: 'Details',
        body: loading ? undefined : detailsTab(),
      }]}  
    />
  );
};

/**
 * The modal for vertical data
 */
export const VerticalModal = withRouter(VerticalModalBase);

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
const validateData = (data: any, setErrors: any, passive?: boolean) => {
  const errors: any = {};

  // Validate different fields
  if (!data.name) errors.name = 'Name cannot be blank';

  if (!data.description) errors.description = 'Description cannot be blank';

  if (!data.leadEmail) errors.leadEmail = 'Lead Email cannot be blank';
  else if (!Validate.email(data.leadEmail, true)) errors.leadEmail = 'Lead Email is formatted incorrectly';

  if (!data.leadEmailTest) errors.leadEmailTest = 'Lead Test Email cannot be blank';
  else if (!Validate.email(data.leadEmailTest, true)) errors.leadEmailTest = 'Lead Test Email is formatted incorrectly';

  if (!data.leadSlack) errors.leadSlack = 'Lead Slack cannot be blank';
  else if (!Validate.slack(data.leadSlack)) errors.leadSlack = 'Lead Slack \
  is formatted incorrectly (make sure not to include a # because it\'s done automatically)';

  if (!data.leadSlackTest) errors.leadSlackTest = 'Lead Test Slack cannot be blank';
  else if (!Validate.slack(data.leadSlackTest)) errors.leadSlackTest = 'Lead Test Slack \
  is formatted incorrectly (make sure not to include a # because it\'s done automatically)';

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
    leadEmail: '',
    leadEmailTest: '',
    leadSlack: '',
    leadSlackTest: '',
    description: '',
  },
};
