import * as React from 'react';
import { Dialog } from '@material-ui/core';
import './SimpleModal.scss';

/** 
 * Defines expected props for this component
 */
interface IProps {
  /**
   * className applied to component
   */
  className?: string;
  /**
   * whether the modal is currently open
   */
  open: boolean;
  /**
   * function to run when modal is being closed
   */
  onClose: (...args: any[]) => any;
  /**
   * whether clicking the backdrop should close the modal
   */
  disableBackdropClick?: boolean | undefined;
  /**
   * components to render inside of modal
   */
  children: React.ReactNode;
}

/** 
 * A basic modal
 */
export const SimpleModal = (props: IProps) => {

  return (
    <Dialog
      open={props.open}
      onClose={props.onClose}
      className={`simpleModal ${props.className ? props.className : ''}`}
      disableBackdropClick={props.disableBackdropClick}
    >
      {props.children}
    </Dialog>
  );
};