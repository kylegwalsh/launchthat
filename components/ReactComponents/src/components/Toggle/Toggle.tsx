import * as React from 'react';
import ReactToggle from 'react-toggle';
import './Toggle.scss';

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * the current status of the toggle
   */
  value: boolean;
  /**
   * function to run when toggle is clicked
   */
  onClick?: (...args: any[]) => any;
  /**
   * label to show over the toggle (like an input label)
   */
  label?: string;
  /**
   * whether the toggle is disabled
   */
  disabled?: boolean;
}

/**
 * A toggle component to change the active status of something
 */
export const Toggle = (props: IProps) => {
  return (
    <div className={`toggle__container ${props.className ? props.className : ''}`}>
      { // If a label is provided, show it
        props.label &&
        <label className='toggle__label'>{props.label}</label>
      }
      <div className='toggle__innerContainer'>
        <ReactToggle
          checked={props.value}
          icons={false}
          onChange={props.onClick}
          disabled={props.disabled}
        />
      </div>
    </div>
  );
};