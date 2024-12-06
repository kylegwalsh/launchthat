import * as React from 'react';
import './DraggableInput.scss';

interface IProps {
  /**
   * object containing classNames
   */
  className?: {
    /**
     * className applied to container
     */
    container?: string;
    /**
     * className applied to actual input
     */
    input?: string;
  };
}

export const DraggableInput = (props: IProps) => {

  return (
    <div className={`input__container ${(props.className && props.className.container) ? props.className.container : ''}`}>
      <p>Start of a DraggableInput</p>
    </div>
  );
};