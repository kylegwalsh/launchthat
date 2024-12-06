import * as React from 'react';
const { useState, memo, forwardRef, useImperativeHandle } = React;
import { Input, Select } from '../../../';
// tslint:disable-next-line: no-submodule-imports
import { MdCancel, MdAddCircle } from 'react-icons/md';
import './FieldMapRow.scss';

/**
 * Defines expected props for options
 */
interface IOption {
  /**
   * visible value for option
   */
  label: string;
  /**
   * actual value for option
   */
  value?: any;
}

/**
 * Defines expected props for ReactSelect options
 */
interface IReactSelectOption {
  /**
   * visible value for option
   */
  label: string;
  /**
   * actual value for option
   */
  value?: any;
  /**
   * nested options
   */
  options?: IOption[];
}

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * what possible options to allow as the targets (usually array of approved fields).
   * If not specified, the target will be a normal input
   */
  options?: IReactSelectOption[];
  /**
   * optional id for the mapping
   */
  id?: number;
  /**
   * the key of the mapping
   */
  target: string;
  /**
   * the value of the mapping
   */
  output: string;
  /**
   * whether to show the label
   */
   /**
    * labels for target and output fields
    */
  labels?: {
    target?: string;
    output?: string;
  };
  showLabel?: boolean;
  /**
   * optional field to disable inputs
   */
  disabled?: {
    /**
     * disable target field
     */
    target?: boolean;
    /**
     * disable output field
     */
    output?: boolean;
  };
  /**
   * whether to disable both fields
   */
  disableAll?: boolean;
  /**
   * function used to delete the row
   */
  deleteRow?: (...args: any[]) => any;
  /**
   * function used to add a new row
   */
  addRow?: (...args: any[]) => any;
  /**
   * object containing target and output errors
   */
  errors?: { target?: string, output?: string };

  /**
   * Checks whether the ability to add in rows or delete them is added
   */
  disableAdditions?: boolean;
  /**
   * Determines whether or not the values should be automatically filled in the ouput
   */
  autofillOff?: boolean;
}

/**
 * A field map row component (used to map inputs to outputs)
 */
export const FieldMapRow = memo(forwardRef((props: IProps, ref) => {
  // Manage values locally
  // @ts-ignore
  const [id, setId] = useState(props.id);
  const [target, setTarget] = useState(props.target);
  const [output, setOutput] = useState(props.output);

  useImperativeHandle(ref, () => ({
    getValues() {
      const values: any = { target, output };
      if (id !== undefined) values.id = id;
      return values;
    },
  }), [id, target, output]);

  /**
   * If the row with the input is the last row, we need to add a new one before recording event
   * @param value - value from input change event
   * @param isTarget - whether the field was the target field
   * @param addRow - function to add a new row
   * @param select - whether the select was used
   */
  const checkInput = (
    value: string,
    isTarget: boolean,
    addRow?: (...ars: any[]) => any,
  ) => {
    // Set output value
    if (!isTarget) setOutput(value);

    // Set target value
    if (isTarget) {
      setTarget(value);
      // Pre-populate output if it was empty
      // Remove the auto populate feature
      if (!output && props.options && !props.autofillOff) setOutput(value);
    } 

    // See if we need to add a new row
    if (!!addRow && !props.disableAdditions) {
      addRow();
    }
  };

  return (
    <div className={`row ${props.className ? props.className : ''}`}>
      <div className='column'>
        { // If options are provided, use select
          props.options &&
          <Select 
            label={props.showLabel ? (props.labels && props.labels.target) ? props.labels.target : 'Input' : undefined}
            value={target}
            disabled={props.disableAll || (props.disabled && props.disabled.target)}
            onChange={(value: any) => checkInput(value, true, props.addRow)}
            options={props.options}
            error={props.errors ? props.errors.target : undefined}
          />
        }
        { // If no options are provided, use normal input
          !props.options &&
          <Input
            label={props.showLabel ? (props.labels && props.labels.target) ? props.labels.target : 'Input' : undefined}
            disabled={props.disableAll || (props.disabled && props.disabled.target)}
            value={target}
            onChange={(event: any) => checkInput(event.target.value, true, props.addRow)}
            error={props.errors ? props.errors.target : undefined}
          />
        }
      </div>
      <div className='column'>
        <Input
          label={props.showLabel ? (props.labels && props.labels.output) ? props.labels.output : 'Output' : undefined}
          disabled={props.disableAll || (props.disabled && props.disabled.output)}
          value={output}
          onChange={(event: any) => checkInput(event.target.value, false, props.addRow)}
          error={props.errors ? props.errors.output : undefined}
        />
      </div>
      {
        !props.disableAdditions && 
      <div className={`fieldMapRow__iconColumn ${props.showLabel ? 'fieldMapRow__iconColumn__iconEnd' : ''}`}>
        {generateIcons(props.deleteRow, props.addRow)}
      </div>
      }
    </div>
  );
}));

// HELPERS

/**
 * Generate the icons next to the field (if needed)
 * @param deleteRow - function used to delete the row
 * @param addRow - function used to add a new row
 */
// @ts-ignore
const generateIcons = (deleteRow?: (...args: any[]) => any, addRow?: (...args: any[]) => any) => {
  // If add row function is provided, show add icon
  if (!!addRow) return <MdAddCircle className='fieldMapRow__addIcon' onClick={addRow}/>;

  // Otherwise, if delete function is provided, show delete icon
  if (!!deleteRow) return <MdCancel className='fieldMapRow__deleteIcon' onClick={deleteRow}/>;
};