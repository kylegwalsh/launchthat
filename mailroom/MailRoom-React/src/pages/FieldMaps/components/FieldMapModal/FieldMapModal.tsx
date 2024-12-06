import React, { Fragment, useState, useEffect, useRef } from 'react';
import { DataModal, Input, Button, Label, FieldMapList } from 'lt-components';
import { useAPI, useModalRoute } from '../../../../hooks';
import { withRouter, RouteComponentProps } from 'react-router-dom';
import { Validate } from '../../../../utilities';
import { NotificationStore, UserStore } from '../../../../stores';
import './FieldMapModal.scss';

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
  /**
   * Check to see if we are using categories
   */
  categories: boolean; 
}

/** 
 * The modal for field map data
 */
const FieldMapModalBase = (props: IProps & RouteComponentProps<any>) => {
  // Extract field params to figure out which item is being modified or created
  const id = props.match.params.id;
  options.id = id;
  
  // Track when form is submitted
  const [submitted, setSubmitted] = useState(false);
  // Fetch data using api hook
  const [loading, data, setData, errors, setErrors, queryAPI, refreshData] = useAPI('field_maps', JSON.parse(JSON.stringify(options)));
  // State to manage modal open state
  const [open, closeModal] = useModalRoute(props.navigateBack);
  // Track active tab
  const [activeTab, setActiveTab] = useState(0);
  // Also fetch approved fields to display as options in selects
  const [approvedLoading, approvedData, setApprovedData] = useAPI('fields', JSON.parse(JSON.stringify(approvedOptions)));
  // Access field map list data
  const fieldMapRef = useRef<FieldMapList>(null);
  // Stupid state to reset field map if submission fails
  const [resetFieldMap, setResetFieldMap] = useState(false);

  // Set header based on operation being performed
  const headerText = UserStore.user && UserStore.user.isAdmin ? (id === 'add' ? 'New Field Map' : 'Edit Field Map') : 'View Field Map';

  /**
   * Initialize the field map data when we finish loading the first time
   */
  useEffect(() => {
    if (!loading && !approvedLoading && !submitted) {
      // Format approved fields data
      const approvedFields: any[] = [];
      approvedData.forEach((field: any) => {
        approvedFields.push({
          label: field.name,
          value: field.name,
        });
      });

      // Initialize the field map
      setApprovedData(approvedFields);
      if (fieldMapRef.current) fieldMapRef.current.initFieldMap(data.fieldMap);
    }
  }, [loading, approvedLoading]);

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

  /**
   * Revalidates after submission
   */
  useEffect(() => {
    // Revalidate data after change if we previously had an error
    if (submitted && !data.internalEmail) validateData(data, setErrors, false, true, errors);
  }, [data]);

  const queryWithCategories = async() => {
    let fieldMap = null;
    if (fieldMapRef.current) fieldMap = fieldMapRef.current.retrieveFieldMap();
    const fetchedData = { name: data.name, internalEmail: data.internalEmail, fieldMap };

    const valid = validateData(fetchedData, setErrors, true);

    if (!submitted) setSubmitted(true);

    if (valid) {

      if (fetchedData.fieldMap) {
        fetchedData.fieldMap.forEach((category: any) => {
          const categoryName = Object.keys(category)[0];

          delete category.id;

          category[categoryName].forEach((field: any) => {
            delete field.id;
          });
        });
      }

      // We are either creating a new object or updating one
      const result = await queryAPI(id === 'add' ? 'POST' : 'PUT', {
        id: id === 'add' ? undefined : id,
        data: fetchedData,
      });

      if (!result.error) {
        NotificationStore.addNotification(
          'success',
          `${fetchedData.name} was successfully ${id === 'add' ? 'added' : 'edited.'}`,
          `Success`,
          2000,
        );
        props.navigateBack(true);
      }
      // Reset field map state
      else {
        setData(fetchedData);
        setResetFieldMap(true);
      }
    }
  };

  /**
   * Validate and then query the api using the new data
   */
  const query = async() => {
    console.log('Querying api');

    // Retrieve field map from fieldMapList component
    let fieldMap = null;
    if (fieldMapRef.current) fieldMap = fieldMapRef.current.retrieveFieldMap();
    const fetchedData = { name: data.name, internalEmail: data.internalEmail, fieldMap };

    // Start by validating fields
    const valid = validateData(fetchedData, setErrors, false);
    // Mark the fact that we've submitted the form at least once
    if (!submitted) setSubmitted(true);

    // If the data was valid, query the api
    if (valid) {
      console.log('valid');

      // Format the field map for submission
      if (fetchedData.fieldMap) {
        // Remove id fields
        fetchedData.fieldMap.forEach((map) => {
          delete map.id;
        });

        // Alphabetize the field map array (if this is an external field map)
        if (!fetchedData.internalEmail) {
          fetchedData.fieldMap.sort((a: any, b: any) => {
            const aTarget = a.target.toLowerCase();
            const bTarget = b.target.toLowerCase();
            
            // Sort based on target
            if (aTarget < bTarget) return -1;
            if (aTarget > bTarget) return 1;
            return 0;
          });
        }
      }

      // We are either creating a new object or updating one
      const result = await queryAPI(id === 'add' ? 'POST' : 'PUT', {
        id: id === 'add' ? undefined : id,
        data: fetchedData,
      });

      // If there were no errors, show a success message and navigate back
      if (!result.error) {
        NotificationStore.addNotification(
          'success',
          `${fetchedData.name} was successfully ${id === 'add' ? 'added' : 'edited.'}`,
          `Success`,
          2000,
        );
        props.navigateBack(true);
      }
      // Reset field map state
      else {
        setData(fetchedData);
        setResetFieldMap(true);
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
              required={!data.internalEmail && UserStore.user && UserStore.user.isAdmin}
              disabled={data.internalEmail || (UserStore.user && !UserStore.user.isAdmin)}
              onChange={(event) => updateField('name', event.target.value, data, setData, setErrors, submitted)}
            />
          </div>
        </div>

        <div className='row'>
          <div className='column'>
            <div className='input__container'>
              <Label text='Mapping' required={UserStore.user && UserStore.user.isAdmin}/>
              <div className={`fieldMapModal__mappingContainer input ${errors.fieldMap ? 'error' : ''}`}>
                <FieldMapList
                  ref={fieldMapRef}
                  options={approvedData}
                  useCategories={data.internalEmail}
                  disabled={UserStore.user && !UserStore.user.isAdmin}
                  errors={errors.fieldMapInputs}
                />
              </div>
              { // If an error is provided, show it
                errors.fieldMap &&
                <label className='input__required'>{errors.fieldMap}</label>
              }
            </div>
          </div>
        </div>

        { // Remove button if user cannot edit anyways
          UserStore.user && UserStore.user.isAdmin &&
          <div className='row m-0'>
            <Button className='dataModal__button' onClick={() => props.categories ? queryWithCategories() : query()}>Save</Button>
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
      className={`fieldMap__dataModal ${props.className ? props.className : ''}`}
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
 * The modal for field map data
 */
export const FieldMapModal = withRouter(FieldMapModalBase);

// HELPERS

/**
 * Function to update a property of the data
 * @param field - the field name to update
 * @param value - the value to update the field with
 * @param data - the original data object
 * @param setData - the function to update the data
 * @param submitted - whether the form has already been submitted once
 */
const updateField = (field: string, value: any, data: any, setData: any, setErrors: any, submitted: boolean) => {
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
const validateData = (data: any, setErrors: any, useCategories: boolean, passive?: boolean, prevErrors?: any) => {
  const errors: any = {};
  errors.fieldMapInputs = {};

  // Validate different fields
  if (!data.name) errors.name = 'Name cannot be blank';

  if (useCategories) {
    if (!passive) {
      errors.fieldMap = '';
      if (!data.fieldMap || !data.fieldMap.length) {
        errors.fieldMap = 'Field map must contain at least one field mapping. The field map will only be re-validated when you try to save';
      } else {
        // Track different error types
        const errorTypes: any = {};
      // We need to check each map (none should be mapped twice or be blank)
        const alreadyMapped: any = {};
        data.fieldMap.forEach((category: any) => {
          
          // Get the name of the category that needs to be checked
          const categoryName = Object.keys(category)[0];

          if (!category[categoryName].length) {
            if (!errors.fieldMapInputs[category.id]) errors.fieldMapInputs[category.id] = {};
            errors.fieldMapInputs[category.id] = 'Please make sure you specify at least one field in the category';
            errorTypes.noFieldsInCategory = true;
          }

          if (!categoryName) {
            if (!errors.fieldMapInputs[category.id]) errors.fieldMapInputs[category.id] = {};
            errors.fieldMapInputs[category.id] = 'Category cannot be empty';
            errorTypes.emptyCategory = true;
          } else {
            if (alreadyMapped[categoryName]) {
              if (!errors.fieldMapInputs[category.id]) errors.fieldMapInputs[category.id] = {};
              errors.fieldMapInputs[category.id] = 'This category already exists';
              errorTypes.duplicateCategory = true;
            } else alreadyMapped[categoryName] = true;
          }
          
          // Check for empty mapping
          category[categoryName].forEach((map: any) => {
            if (!map.target || !map.output) {
              if (!map.target) {
                if (!errors.fieldMapInputs[map.id]) errors.fieldMapInputs[map.id] = {};
                errors.fieldMapInputs[map.id].target = 'Field cannot be empty';
                errorTypes.empty = true;
              }
              if (!map.output) {
                if (!errors.fieldMapInputs[map.id]) errors.fieldMapInputs[map.id] = {};
                errors.fieldMapInputs[map.id].output = 'Field cannot be empty';
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
        });

        if (errorTypes.duplicateCategory) {
          errors.fieldMap += `Your field map has at least one category that appears twice (should only appear once)`;
        }

        if (errorTypes.emptyCategory) {
          errors.fieldMap += `Your field map should not contain any blank categories`;
        }
        if (errorTypes.noFieldsInCategory) {
          errors.fieldMap += `Your feild map has at least one category without fields`;
        }
        // Set error messages
        if (errorTypes.duplicate) {
          errors.fieldMap += `Your field map has at least one input that appears twice (should only appear once)`;
        }
        if (errorTypes.empty) {
          errors.fieldMap += `${errors.fieldMap ? '. ' : ''}` + 
          `Your field map should not contain any blank inputs or outputs`;
        }
        // Note that validation will only run 
        if (errors.fieldMap) {
          errors.fieldMap += `. The field map will only be re-validated when you try to save`;
        }
      }
      if (!errors.fieldMap) {
        delete errors.fieldMapInputs;
        delete errors.fieldMap;
      }
    }// Keep old field map errors if passive
    else {
      errors.fieldMap = prevErrors.fieldMap;
      errors.fieldMapInputs = prevErrors.fieldMapInputs;
    }

    setErrors(errors);

    // Set any errors that occurred (if we are submitting the form)
    if (!passive && !Validate.empty(errors)) {
      NotificationStore.addNotification('error', 'Please fix any fields with errors and try again.', 'Field Errors', 2000);
      return false;
    }

    return true;
  } else {
  
    // Never validate field map passively
    if (!passive) {
      errors.fieldMap = '';
      if (!data.fieldMap || !data.fieldMap.length) {
        errors.fieldMap = 'Field map must contain at least one field mapping. The field map will only be re-validated when you try to save';
      }
      else {
        // Track different error types
        const errorTypes: any = {};
        // We need to check each map (none should be mapped twice or be blank)
        const alreadyMapped: any = {};
        data.fieldMap.forEach((map: any) => {
          // Check for empty mapping
          if (!map.target || !map.output) {
            if (!map.target) {
              if (!errors.fieldMapInputs[map.id]) errors.fieldMapInputs[map.id] = {};
              errors.fieldMapInputs[map.id].target = 'Field cannot be empty';
              errorTypes.empty = true;
            }
            if (!map.output) {
              if (!errors.fieldMapInputs[map.id]) errors.fieldMapInputs[map.id] = {};
              errors.fieldMapInputs[map.id].output = 'Field cannot be empty';
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
        `Your field map should not contain any blank inputs or outputs`;
        }
        // Note that validation will only run 
        if (errors.fieldMap) {
          errors.fieldMap += `. The field map will only be re-validated when you try to save`;
        }
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

    setErrors(errors);

    // Set any errors that occurred (if we are submitting the form)
    if (!passive && !Validate.empty(errors)) {
      NotificationStore.addNotification('error', 'Please fix any fields with errors and try again.', 'Field Errors', 2000);
      return false;
    }

    return true;

  }
};

/**
 * Options used in API hook (defines id of item to fetch and an empty representation of the object in case we're adding it)
 */
const options = {
  id: '',
  emptyObj: {
    name: '',
    description: '',
    internalEmail: false,
    fieldMap: [],
  },
};

/**
 * Options used to retrieve approved fields from API hook
 */
const approvedOptions = {
  apiName: 'homebase',
  queryParams: 'order[name]=asc',
};