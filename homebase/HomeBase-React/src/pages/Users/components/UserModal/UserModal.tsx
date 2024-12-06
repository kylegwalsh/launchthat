import React, { Fragment, useState, useEffect } from 'react';
import { DataModal, Input, TextArea, Button, CheckboxList, Label, Toggle } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
import './UserModal.scss';

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
 * The modal for user data
 */
const UserModalBase = (props: IProps & RouteComponentProps<any>) => {
  // Extract route params to figure out which item is being modified or created
  const id = props.match.params.id;
  options.id = id;
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI(`users`, JSON.parse(JSON.stringify(options)));
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [ activeTab, setActiveTab ] = useState(0);

  const appRoleNames = ['ROLE_BACKLINK', 'ROLE_HOMEBASE', 'ROLE_MAILROOM', 'ROLE_PAIDPAL'];

  const [ isAdmin, setIsAdmin ] = useState(false);

  const [ appRoles, setAppRoles ] = useState<any>([]);

  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? (id === 'add' ? 'New User' : 'Edit User') : 'View User ';

  /**
   * Revalidates after submission
   */
  useEffect(() => {
    // Revalidate data after change if we previously had an error
    if (submitted) validateData(data, setErrors, true);
  }, [data]);

  const prettifyRole = (role: string) => {
    return role.charAt(5).toUpperCase() + role.toLowerCase().slice(6, role.length);
  };

  useEffect(() => {
    const appRolesList: any = [];
    if (!loading) {
      for (const roleName of appRoleNames) {
        appRolesList.push({ value: roleName, label: prettifyRole(roleName), checked: false });
      }

      if (data) {
        for (const role of data.roles) {
          if (role === 'ROLE_ADMIN') {
            setIsAdmin(true);
          } else {
            for (const appRole of appRolesList) {
              if (appRole.value === role) appRole.checked = true;
            }
          }
        }
      }
      setAppRoles(appRolesList);
    }
  }, [ loading ]);

  const changeAppRole = (role: string) => {
    const newAppRoles = appRoles.splice(0);
    for (const appRole of newAppRoles) {
      if (appRole.value === role) appRole.checked = !appRole.checked;
    }
    setAppRoles(newAppRoles);
  };

  /**
   * Validate and then query the api using the new data
   */
  const query = async() => {
    console.log('Querying api');
    // Start by validating fields
    const roles = [];
    
    // Create additional roles
    if (isAdmin) roles.push('ROLE_ADMIN');
    for (const role of appRoles) {
      if (role.checked) roles.push(role.value);
    }

    const fetchedData = { ...data, roles };
    const valid = validateData(fetchedData, setErrors);

    // Mark the fact that we've submitted the form at least once
    if (!submitted) setSubmitted(true);

    // If the data was valid, query the api
    if (valid) {
      console.log('valid');
      // We are either creating a new object or updating one
      const result = await queryAPI(id === 'add' ? 'POST' : 'PUT', {
        id: id === 'add' ? undefined : id,
        data: fetchedData,
      });

      // If there were no errors, show a success message and navigate back
      if (!result.error) {
        NotificationStore.addNotification(
          'success',
          `${data.username} was successfully ${id === 'add' ? 'added' : 'edited.'}`,
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
    console.log('IS ADMIN', isAdmin);
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
          <div className='column userModal__rolesContainer'>
            <Input
              label='Email'
              value={data.email}
              error={errors.email}
              autoComplete='off'
              required={UserStore.user && UserStore.user.isAdmin}
              disabled={UserStore.user && !UserStore.user.isAdmin}
              onChange={(event) => updateField('email', event.target.value, data, setData)}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column userModal__checkColumn'>
            <Label text={'App Roles'}/>
            <div className='userModal__checkboxContainer'>
              <CheckboxList
                values={appRoles}
                disabled={UserStore.user && !UserStore.user.isAdmin}
                onChange={(event) => changeAppRole(event.target.value)}
              />
            </div>
          </div>
          <div className='column userModal__toggleColumn'>
            <Label text={'Admin'}/>
            <Toggle
              className='userModal__toggle'
              disabled={UserStore.user && !UserStore.user.isAdmin}
              value={isAdmin}
              onClick={() => setIsAdmin(!isAdmin)}
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
 * The modal for user data
 */
export const UserModal = withRouter(UserModalBase);

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
  if (!data.email) errors.email = 'Email cannot be blank';

  if (!data.name) errors.name = 'Name cannot be blank';

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
    userName: '',
    googleId: '',
  },
};
