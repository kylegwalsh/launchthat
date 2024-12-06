import * as React from 'react';
const { memo } = React;
import { Select } from '../';
// tslint:disable-next-line: no-submodule-imports
import { MdCancel, MdAddCircle } from 'react-icons/md';
import './SelectRow.scss';

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
  options: IReactSelectOption[];
  /**
   * optional id for the mapping
   */
  id?: number;
  /**
   * value selected
   */
  value: string;
  /**
   * optional field to select
   */
  disabled?: boolean;
  /**
   * function to handle changes
   */
  onChange?: (...args: any[]) => any;
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
  error?: string;
}

/**
 * A select row component (used to make selections in a list)
 */
export const SelectRow = memo((props: IProps, ref) => {
  /**
   * If the row with the input is the last row, we need to add a new one before recording event
   * @param value - value from input change event
   * @param isTarget - whether the field was the target field
   * @param addRow - function to add a new row
   * @param select - whether the select was used
   */
  const checkInput = (value: string, addRow?: (...ars: any[]) => any) => {
    // Set target value
    if (props.onChange) {
      props.onChange(value);

      // See if we need to add a new row
      if (!!addRow) addRow();
    }
  };

  return (
    <div className={`row ${props.className ? props.className : ''}`}>
      <div className='column'>
        <Select 
          disabled={props.disabled}
          value={props.value}
          onChange={(value) => checkInput(value, props.addRow)}
          required
          options={props.options}
          error={props.error}
        />
      </div>
      { // Render icons if the list is not disabled
        !props.disabled &&
        <div className={`selectRow__iconColumn`}>
          {generateIcons(props.deleteRow, props.addRow)}
        </div>
      }
    </div>
  );
});

// HELPERS

/**
 * Generate the icons next to the field (if needed)
 * @param deleteRow - function used to delete the row
 * @param addRow - function used to add a new row
 */
const generateIcons = (deleteRow?: (...args: any[]) => any, addRow?: (...args: any[]) => any) => {
  // If add row function is provided, show add icon
  if (!!addRow) return <MdAddCircle className='selectRow__addIcon' onClick={addRow}/>;

  // Otherwise, if delete function is provided, show delete icon
  if (!!deleteRow) return <MdCancel className='selectRow__deleteIcon' onClick={deleteRow}/>;

  return;
};