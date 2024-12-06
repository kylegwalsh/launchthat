import * as React from 'react';
// tslint:disable-next-line: no-submodule-imports
import { MdEdit, MdDelete, MdRemoveRedEye } from 'react-icons/md';
import './OperationButtons.scss';

/**
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * function to be used for view operation
   */
  view?: (...args: any[]) => void;
  /**
   * function to be used for edit operation
   */
  edit?: (...args: any[]) => void;
  /**
   * function to be used for delete operation
   */
  delete?: (...args: any[]) => void;
}

/**
 * Includes a list of generic buttons for table operations
 */
export const OperationButtons = (props: IProps) => {
  return (
    <div className='operationButton__container'>
      { props.view && <MdRemoveRedEye className={`operationButton ${props.className ? props.className : ''}`} onClick={props.view}/> }
      { props.edit && <MdEdit className={`operationButton ${props.className ? props.className : ''}`} onClick={props.edit}/> }
      { props.delete && <MdDelete className={`operationButton ${props.className ? props.className : ''}`} onClick={props.delete}/> }
    </div>
  );
};