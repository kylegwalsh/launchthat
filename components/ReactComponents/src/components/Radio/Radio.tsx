import * as React from 'react';
import { Radio as MaterialRadio } from '@material-ui/core';
import './Radio.scss';

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
   * value associated with checkbox
   */
  value: string;
  /**
   * function to run when check state changes
   */
  onChange?: (...args: any[]) => any;
  /**
   * Determines whether the radio button is disabled
   */
  disabled?: boolean;
}

/**
 * A radio button
 */
export const Radio = (props: IProps) => {
  return (
    <MaterialRadio
      classes={{ root: `radio ${props.className ? props.className : ''}`, checked: 'radio--checked' }}
      checked={props.checked}
      value={props.value}
      onChange={props.onChange}
      disabled={props.disabled}
    />
  );
};