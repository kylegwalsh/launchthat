import * as React from 'react';
import { Checkbox as MaterialCheckbox } from '@material-ui/core';
import './Checkbox.scss';
// tslint:disable-next-line: no-submodule-imports
import RadioButtonUncheckedIcon from '@material-ui/icons/RadioButtonUnchecked';
// tslint:disable-next-line: no-submodule-imports
import RadioButtonCheckedIcon from '@material-ui/icons/RadioButtonChecked';
// import { withStyles } from '@material-ui/core/styles';

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * whether the box is checked
   */
  checked: boolean;
  /**
   * function to run when check state changes
   */
  onChange: (...args: any[]) => any;
  /**
   * value associated with checkbox
   */
  value: string;
  /**
   * Defines whether or not the checkboxes should look like radios
   */
  radioStyle?: boolean;
  /**
   * A boolean to determine if the checkbox is disabled
   */
  disabled?: boolean;
}

/**
 * A checkbox component
 */
export const Checkbox = (props: IProps) => {
  return (
    <MaterialCheckbox
      icon={props.radioStyle && <RadioButtonUncheckedIcon/> } 
      checkedIcon={props.radioStyle && <RadioButtonCheckedIcon/> } 
      className={`checkBox
        ${props.className && props.className ? props.className : ''}
        ${props.checked ? 'checkBox--checked' : ''}
      `}
      checked={props.checked}
      onChange={props.onChange}
      value={props.value}
      disabled={props.disabled}
    />
  );
};