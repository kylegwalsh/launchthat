import * as React from 'react';
import { Button as MaterialButton } from '@material-ui/core';
import './Button.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * function to run when button is clicked
   */
  onClick: (...args: any[]) => any;
  /**
   * whether the button is disabled or not
   */
  disabled?: boolean;
  /**
   * any nested text or components to render inside the button
   */
  children?: React.ReactNode;
}

/** 
 * A basic button
 */
export const Button = (props: IProps) => {
  return (
    <MaterialButton disabled={props.disabled} onClick={props.onClick} className={`button ${props.className ? props.className : ''}`}>
      {props.children}
    </MaterialButton>
  );
};