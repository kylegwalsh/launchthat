import * as React from 'react';
const { useState } = React;
import { SimpleModal, Input, Button, Loading, Label } from '../..';
// tslint:disable-next-line: no-submodule-imports
import { MdClear } from 'react-icons/md';
import './DeleteModal.scss';
import { Link } from 'react-router-dom';

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
   * function to run once deletion is confirmed
   */
  delete: (...args: any[]) => any;
  /**
   * Determine if the modal should be loading
   */
  loading?: boolean;
  /**
   * Items that are pending deletion and thus the delete action can't be performed
   */
  pendingDeletes?: {
    /**
     * Variable Id key name use to specify that category of the object in the pending deletions
     */ 
    [ key: string ]: { 
      // The name in the object
      name: string; 
      // A link to the desired item that needs to be deleted
      link?: string;
    }[]; 
  }[];
  /**
   * Text used for specifying what needs to be removed for pending deletions
   */
  pendingDeleteText?: string;

  pendingDeleteInternalLink?: boolean;
  /**
   * The name of the item that's being deleted (Used delete stopper + used in the name)
   */
  deleteName?: string;
}

/** 
 * A modal meant for confirmation of deletions
 */
export const DeleteModal = (props: IProps) => {
  const [text, setText] = useState('');

  /**
   * Clear input when modal is closed
   */
  const closeModal = () => {
    setText('');
    props.onClose();
  };

  /**
   * Handle deletion of data (and close modal)
   */
  const deleteEntry = async() => {
    await props.delete();
    closeModal();
  };

  return (
    <SimpleModal open={props.open} onClose={closeModal} className={`deleteModal ${props.className ? props.className : ''}`}>
      {/* Header */}
      <div className='deleteModal__header'>
        <h2 className='deleteModal__headerText'>
          {props.deleteName ? `Are you sure you want to delete ${props.deleteName}?` : 'Are you sure?'}
        </h2>
        <MdClear className='deleteModal__exit' onClick={closeModal}/>
      </div>

      {/* Body */}
      { // Add a loading spinner
        props.loading && 
        <Loading/>
      }
      { // Check for loading before adding in the content for deletion 
        !props.loading &&
        <div>
            
          <div className='row m-0'>
            { // If we don't have any items pending deletion, show the normal delete message
              !props.pendingDeletes && (
               props.deleteName ? 
               <p>To confirm the deletion of this item, please type <strong>{props.deleteName}</strong> into the input below.</p> :
               <p>To confirm the deletion of this item, please type <strong>DELETE</strong> into the input below.</p> 
              )
            }
            { // If we do have items pending deletion, show the message provided about them
              props.pendingDeletes && 
              <p>
                {props.pendingDeleteText}
              </p>
            }
          </div>
          { // If we don't have any pending deletes, show normal delete functionality
            !props.pendingDeletes && 
            <React.Fragment>
              <div className='row'>
                <div className='column'>
                  <Input
                    value={text}
                    autoComplete='off'
                    onChange={(event) => setText(event.target.value)}
                  />
                </div>
              </div>
              <div className='row m-0'>
                <Button
                  disabled={text !== (props.deleteName ? props.deleteName : 'DELETE')} 
                  className='deleteModal__button' 
                  onClick={() => deleteEntry()}
                >
                  Delete
                </Button>
              </div>
            </React.Fragment>
          }
          { // If we have things that are pending deletion, list them
            props.pendingDeletes &&
            <React.Fragment>
              <div className='row'>
                <div className='column'>
                  {
                    Object.keys(props.pendingDeletes).map((key, index) => {
                      return (
                        <div key={index}>
                          {(props.pendingDeletes && props.pendingDeletes[key].length !== 0) && <Label text={key}/>}
                          <ul>
                          {
                            props.pendingDeletes && props.pendingDeletes[key].map((item: any, index: number) => {
                              return (
                                <li key={index}>
                                  {
                                  !props.pendingDeleteInternalLink && 
                                  <a target='_blank' href={item.link}>
                                    <p>{item.name}</p>
                                  </a>
                                  }
                                  {
                                  props.pendingDeleteInternalLink && 
                                    <Link to={item.link}>
                                      {item.name}
                                    </Link>
                                  }
                                </li>);
                            })
                          } 
                          </ul>
                        </div>
                      );
                    })
                  }
                </div>
              </div>
            </React.Fragment>
          }

        </div>
      }
    </SimpleModal>
  );
};