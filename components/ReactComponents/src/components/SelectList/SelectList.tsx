import * as React from 'react';
const { memo } = React;
import { SelectRow } from '../';
import './SelectList.scss';

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
   * which selection exist in the list
   */
  selections: { value: number, id: number, error?: string }[];
  /**
   * what possible options to allow in selects
   */
  options: IReactSelectOption[];
  /**
   * function to update values in the list
   */
  updateRow: (index: number, value: any) => any;
  /**
   * function to add a new row
   */
  addRow: (...args: any[]) => any;
  /**
   * function to delete a row
   */
  deleteRow: (index: number) => any;
  /**
   * whether the select list is disabled and cannot be changed
   */
  disabled?: boolean;
}

/**
 * A list of select options
 */
export const SelectList = memo((props: IProps) => {

  /**
   * Generate select rows
   */
  const generateRows = () => {
    // Make sure selections is set
    if (props.selections.length > 0) {
      // Return moveable category version
      return props.selections.map((selection: any, index: number) => {
        return (
          <SelectRow
            key={selection.id}
            value={selection.value}
            error={selection.error}
            onChange={(value) => props.updateRow(index, value)}
            deleteRow={index !== props.selections.length - 1 ? () => props.deleteRow(index) : undefined}
            addRow={index === props.selections.length - 1 ? () => props.addRow() : undefined}
            options={props.options}
            disabled={props.disabled}
          />
        );
      });
    }

    return;
  };

  return (
    <div className={`row m-r-0 ${props.className ? props.className : ''}`}>
      <div className='column'>
        {generateRows()}
      </div>
    </div>
  );
});