import * as React from 'react';
import './Label.scss';

interface IProps {
  /**
   * classNames to apply to component
   */
  className?: string;
  /**
   * value for input
   */
  text: string;
  /**
   * value for if the label should be required
   */
  required?: boolean;
}

export const Label = (props: IProps) => {
  return (
    <label className={`label ${props.className ? props.className : ''}`}>
      {props.text} { props.required && <span className='label__required'>*</span> }
    </label>
  );
};