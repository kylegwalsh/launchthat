import React, { Fragment, useState, useEffect } from 'react';
import { DataModal, Input, Button, Toggle, Select } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
import './SiteModal.scss';

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
 * The modal for sites data
 */
const SiteModalBase = (props: IProps & RouteComponentProps<any>) => {
  // Extract route params to figure out which item is being modified or created
  const id = props.match.params.id;
  options.id = id;
  
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('sites', JSON.parse(JSON.stringify(options)));
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);

  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? (id === 'add' ? 'New Site' : 'Edit Site') : 'View Site';

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
          <div className='column siteModal__flex4'>
            <Select 
              label='Lead Router'
              value={data.leadRouter}
              onChange={(value) => updateField('leadRouter', value, data, setData)}
              error={errors.leadRouter}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              options={[
                {
                  label: 'Mailroom',
                  value: 'mailroom',
                },
                {
                  label: 'Distroid',
                  value: 'distroid',
                },
                {
                  label: 'Shuttle',
                  value: 'shuttle',
                },
              ]}
            />
          </div>
          <div className='column'>
            <Toggle
              label='Active'
              value={data.active}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onClick={() => updateField('active', !data.active, data, setData)}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <Input
              label='Domain'
              autoComplete='off'
              value={data.domain}
              error={errors.domain}
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('domain', event.target.value, data, setData)}
            />
          </div>
          <div className='column'>
            <Input
              label='Webmaster Email'
              type='email'
              autoComplete='off'
              value={data.webmasterEmail}
              error={errors.webmasterEmail}
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('webmasterEmail', event.target.value, data, setData)}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <Input
              label='Deployment Email'
              value={data.deploymentEmail}
              error={errors.deploymentEmail}
              autoComplete='off'
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('deploymentEmail', event.target.value, data, setData)}
            />
          </div>
          <div className='column'>
            <Input
              label='Deployment Slack'
              value={data.deploymentSlack}
              error={errors.deploymentSlack}
              autoComplete='off'
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('deploymentSlack', event.target.value, data, setData)}
            />
          </div>
        </div>

        { // Remove button if user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <div className='row m-0'>
            <Button className='dataModal__button' onClick={() => setActiveTab(1)}>Next</Button>
          </div>
        }

      </Fragment>
    );
  };

  /**
   * Credentials tab for modal
   */
  const credentialsTab = () => {
    return (
      <Fragment>
        { // Only display app key if we are editing a site (randomly generated when adding)
          id !== 'add' &&
          <div className='row'>
            <div className='column'>
              <Input
                label='App Key'
                value={data.appKey}
                autoComplete='off'
                disabled={true}
              />
            </div>
          </div>
        }

        <div className='row'>
          <div className='column'>
            <Input
              label='UA-ID'
              autoComplete='off'
              value={data.uaId}
              error={errors.uaId}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('uaId', event.target.value, data, setData)}
            />
          </div>
          <div className='column'>
            <Input
              label='AW-ID'
              autoComplete='off'
              value={data.awId}
              error={errors.awId}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('awId', event.target.value, data, setData)}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <Input
              label='Cloudflare Zone'
              value={data.cloudflareZone}
              error={errors.cloudflareZone}
              autoComplete='off'
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('cloudflareZone', event.target.value, data, setData)}
            />
          </div>
        </div>

        { // Remove button user cannot edit anyways
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
      className={`sites__dataModal ${props.className ? props.className : ''}`}
      activeTab={activeTab}
      setActiveTab={setActiveTab}
      tabs={[
        {
          title: 'Details',
          body: loading ? undefined : detailsTab(),
        },
        {
          title: 'Credentials',
          body: loading ? undefined : credentialsTab(),
        },
      ]}
    />
  );
};

/**
 * The modal for site data
 */
export const SiteModal = withRouter(SiteModalBase);

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

  if (!data.leadRouter) errors.leadRouter = 'Lead Router cannot be blank';

  if (!data.domain) errors.domain = 'Domain cannot be blank';
  else if (!Validate.domain(data.domain)) errors.domain = 'Domain is formatted incorrectly (Ex. domain.com)';

  if (!data.webmasterEmail) errors.webmasterEmail = 'Webmaster Email cannot be blank';
  else if (!Validate.email(data.webmasterEmail, true)) errors.webmasterEmail = 'Webmaster Email is formatted incorrectly';

  if (data.deploymentEmail && !Validate.email(data.deploymentEmail, true)) {
    errors.deploymentEmail = 'Deployment Email is formatted incorrectly';
  }

  if (data.deploymentSlack && !Validate.slack(data.deploymentSlack)) errors.deploymentSlack = 'Deployment Slack \
  is formatted incorrectly (make sure not to include a # because it\'s done automatically)';

  if (data.uaId && !Validate.uaId(data.uaId)) errors.uaId = 'UA-ID is formatted incorrectly';

  if (data.awId && !Validate.awId(data.awId)) errors.awId = 'AW-ID is formatted incorrectly';

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
    leadRouter: '',
    active: false,
    domain: '',
    webmasterEmail: '',
    deploymentEmail: '',
    deploymentSlack: '',
    appKey: '',
    uaId: '',
    awId: '',
    cloudflareZone: '',
  },
};